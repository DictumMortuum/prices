import React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Link from './Link';

export default props => {
  const { id, boardgame_id, wishlist } = props;
  const [ wish ] = wishlist.filter(d => d.id === boardgame_id);
  const { thumbnail } = wish;

  return (
    <Card key={id} square={true} elevation={3}>
      <Link to={"/item/" + boardgame_id}>
        <CardMedia style={{ paddingTop: '75%' }} image={thumbnail} />
      </Link>
    </Card>
  )
}
