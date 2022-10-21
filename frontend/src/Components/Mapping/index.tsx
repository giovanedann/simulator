import { Grid, Select, MenuItem, Button } from '@material-ui/core'

function Mapping() {
  return (
    <Grid container>
      <Grid item xs={12} sm={3}>
        <form>
          <Select fullWidth>
            <MenuItem value="">
              <em>Selecione uma corrida</em>
            </MenuItem>
            <MenuItem value="1">
              <em>Veiculo 1</em>
            </MenuItem>
            <MenuItem value="2">
              <em>Veiculo 2</em>
            </MenuItem>
            <MenuItem value="3">
              <em>Veiculo 3</em>
            </MenuItem>
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
