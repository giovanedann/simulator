import { Grid, Select, MenuItem, Button } from '@material-ui/core'
import { Loader } from 'google-maps'
import { io, Socket } from 'socket.io-client'
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
  useCallback,
  useRef
} from 'react'
import { RouteExistsError } from '../../errors/route-exists'
import { INewPositionData, IRoute } from '../../interfaces/Route'
import { getCurrentPosition } from '../../utils/geolocation'
import { makeCarIcon, makeMarkerIcon, Map } from '../../utils/map'
import Navbar from '../Navbar'
import { styles, colors } from './styles'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const mapLoader = new Loader(import.meta.env.VITE_GOOGLE_API_KEY)

function Mapping() {
  const [routes, setRoutes] = useState<IRoute[]>([])
  const [selectedRouteId, setSelectedRouteId] = useState<string>('')
  const mapRef = useRef<Map>()
  const socketIoRef = useRef<Socket>()
  const classes = styles()

  const finishRoute = useCallback((route: IRoute) => {
    toast(`${route?.title} finalizou a rota!`, {
      type: 'success',
      position: 'bottom-left'
    })
  }, [])

  useEffect(() => {
    if (!socketIoRef.current?.connected) {
      socketIoRef.current = io(API_URL, {
        transports: ['websocket', 'polling', 'flashsocket']
      })

      socketIoRef.current?.on('connect', () => {
        console.log('connected')
      })
    }

    const handler = (data: INewPositionData) => {
      mapRef.current?.moveCurrentMarker(data.routeId, {
        lat: data.position[0],
        lng: data.position[1]
      })

      if (data.finished) {
        const route = routes.find(
          (route) => route._id === data.routeId
        ) as IRoute
        finishRoute(route)
        mapRef.current?.removeRoute(route?._id)
      }
    }

    socketIoRef.current?.on('new-position', handler)

    return () => {
      socketIoRef.current?.off('new-position', handler)
    }
  }, [finishRoute])

  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then((data) => data.json())
      .then((data) => setRoutes(data))
  }, [])

  useEffect(() => {
    ;(async () => {
      const [, position] = await Promise.all([
        mapLoader.load(),
        getCurrentPosition({ enableHighAccuracy: true })
      ])

      const mapDiv = document.getElementById('map') as HTMLElement

      mapRef.current = new Map(mapDiv, {
        zoom: 15,
        center: position
      })
    })()
  }, [])

  function handleRouteChange(
    event: ChangeEvent<{ name?: string; value: unknown }>
  ) {
    setSelectedRouteId(event.target.value as string)
  }

  const startRoute = useCallback(
    (event: FormEvent) => {
      event.preventDefault()

      const route = routes.find((route) => route._id === selectedRouteId)
      const randomColorIndex = Math.random() * colors.length
      const iconColor = colors[Math.floor(randomColorIndex)]

      try {
        mapRef.current?.addRoute(selectedRouteId, {
          currentMarkerOptions: {
            position: route?.startPosition,
            icon: makeCarIcon(iconColor)
          },
          endMarkerOptions: {
            position: route?.endPosition,
            icon: makeMarkerIcon(iconColor)
          }
        })
        socketIoRef.current?.emit('new-direction', {
          routeId: selectedRouteId
        })
      } catch (error) {
        if (error instanceof RouteExistsError) {
          toast(`${route?.title} ja inicializado, aguardar finalizar`, {
            type: 'warning',
            position: 'bottom-left'
          })
          return
        }
        throw error
      }
    },
    [selectedRouteId, routes]
  )

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={3}>
        <Navbar />
        <form onSubmit={startRoute} className={classes.form}>
          <Select
            displayEmpty
            fullWidth
            onChange={handleRouteChange}
            value={selectedRouteId}
          >
            <MenuItem value="">
              <em>Selecione uma corrida</em>
            </MenuItem>
            {routes.map((route) => (
              <MenuItem key={route._id} value={route._id ?? ''}>
                {route.title ?? ''}
              </MenuItem>
            ))}
          </Select>
          <div className={classes.submitBtnWrapper}>
            <Button type="submit" color="primary" variant="contained">
              Iniciar uma corrida
            </Button>
          </div>
        </form>
      </Grid>
      <Grid item xs={12} sm={9}>
        <div id="map" className={classes.map} />
      </Grid>
    </Grid>
  )
}

export default Mapping
