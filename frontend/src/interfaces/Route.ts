export interface IPosition {
  lat: number
  lng: number
}

export interface INewPositionData {
  routeId: string
  position: [number, number]
  finished: boolean
}

export interface IRoute {
  _id: string
  title: string
  startPosition: IPosition
  endPosition: IPosition
}
