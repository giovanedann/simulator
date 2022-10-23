import { Position } from 'interfaces/Route'

export function getCurrentPosition(
  options?: PositionOptions
): Promise<Position> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }),
      (error) => reject(error),
      options
    )
  })
}
