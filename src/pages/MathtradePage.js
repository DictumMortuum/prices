import React from 'react';
import Request from '../components/Request';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useId } from '../hooks/useId';

const Styled = back => ({
  whiteSpace: "pre-wrap",
  backgroundColor: back ? "white": "lightgrey",
})

const Component = props => {
  const { data } = props;

  return (
    <Grid container alignContent="center" alignItems="center">
      {data.sort((a, b) => b.items.length - a.items.length).map((d, i) => (
        <Grid key={i} item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Mathtrade ID: {d.id} - Length: {d.length} - Cash#: {d.cash}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                {d.items.map((k, j) => (
                  <Grid key={j} item xs={12} component="pre" style={Styled(j % 2 === 0)}>{k}</Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  )
}

export default () => {
  const id = useId();

  return (
    <Container maxWidth="xl">
      <Request request={`https://raw.githubusercontent.com/DictumMortuum/json-api/master/rest/v1/mathtrade/${id}.json`} initialState={[]}>
        <Component />
      </Request>
    </Container>
  )
}
