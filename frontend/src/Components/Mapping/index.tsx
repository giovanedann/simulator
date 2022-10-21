import { Grid, Select, MenuItem, Button } from '@material-ui/core'
import { ChangeEvent, FormEvent, useEffect, useState, useCallback } from 'react'
import { Route } from '../../interfaces/Route'

const API_URL = import.meta.env.VITE_API_URL

function Mapping() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [selectedRouteId, setSelectedRouteId] = useState<string>('')

  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then((data) => data.json())
      .then((data) => setRoutes(data))
  }, [])

  function handleRouteChange(event: ChangeEvent<{ name?: string; value: unknown }>) {
    setSelectedRouteId(event.target.value as string)
  }

  const startRoute = useCallback((event: FormEvent) => {
    event.preventDefault();
    alert(selectedRouteId);
  }, [selectedRouteId]);

  return (
    <Grid container>
      <Grid item xs={12} sm={3}>
        <form onSubmit={startRoute}>
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
          <Button type="submit" color="primary" variant="contained">
            Iniciar uma corrida
          </Button>
        </form>
      </Grid>
      <Grid item xs={12} sm={9}>
        <div id="map"></div>
      </Grid>
    </Grid>
  )
}

export default Mapping
