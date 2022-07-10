import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import BoardgameImage from './BoardgameImage';
import Link from './Link';
import { useBoardgame } from '../hooks/useBoardgame';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import { useDispatch } from "react-redux";
import { NumericArrayParam, withDefault, useQueryParam } from 'use-query-params';

const useStyles = makeStyles((theme) => ({
  card_header: {
    minHeight: 120,
  },
}));

const onClick = (dispatch, setBggId) => (boardgame_id, bgg_ids) => {
  dispatch({
    type: "ADD_TO_CART",
    cart: boardgame_id,
  })

  if(bgg_ids.includes(boardgame_id)) {
    setBggId(bgg_ids.filter(d => d !== boardgame_id));
  } else {
    setBggId([...bgg_ids, boardgame_id])
  }
}

export default props => {
  const { id, boardgame_id, rank, items } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const boardgame = useBoardgame(boardgame_id);
  const { images, boardgame_name } = boardgame;
  const available_prices = items.sort((a, b) => a.price - b.price)
  const l = available_prices.length;
  const [bgg_ids, setBggId] = useQueryParam("bgg_id", withDefault(NumericArrayParam, []));

  let lowest = undefined;
  let highest = undefined;

  if (l >= 1) {
    lowest = available_prices[0]
  }

  if (l >= 2) {
    if (lowest.price !== available_prices[l-1].price) {
      highest = available_prices[l-1]
    }
  }

  return (
    <Card key={id} square={true} elevation={3}>
      <Link to={"/item/" + boardgame_id}>
        <BoardgameImage srcs={[`https://raw.githubusercontent.com/DictumMortuum/json-api/master/rest/v1/boardgames/${boardgame_id}/image.avif`, ...images]} />
      </Link>
      <CardContent className={classes.card_header}>
        {rank < 999999 && <Typography variant="subtitle1" color="textSecondary">
          BGG Rank {rank}
        </Typography>}
        <Typography variant="subtitle1" color="textSecondary">
          {lowest && "€" + lowest.price} {highest && "- €" + highest.price}
        </Typography>
        <Typography variant="subtitle1">
          {boardgame_name}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={() => onClick(dispatch, setBggId)(boardgame_id, bgg_ids)}>
          <AddShoppingCartIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}
