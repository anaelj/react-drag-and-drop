import React, { useRef, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Container, Label } from "./styles";
import BoradContext from '../Board/context'

function Card({ data, index, listIndex }) {
  const ref = useRef();
  const {move} = useContext(BoradContext);

  const [{ isDragging }, dragRef] = useDrag({
    type: "CARD",
    item: { id: data.id, index, listIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: "CARD",
    hover(item, monitor) {
      // console.log(item.index);
      // console.log(data.id);
      const targetListIndex = listIndex;
      const draggedListIndex = item.listIndex;
      const draggedIndex = item.index;
      const targetIndex = index;

      if (draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
        return;
      }
      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2; // centro do item
      const draggedOffset = monitor.getClientOffset(); // posição do item durente a movimentação
      const draggedTop = draggedOffset.y - targetSize.top;
      
      // console.log(draggedOffset);

      if (draggedIndex < targetIndex && draggedTop < targetCenter){
        return;
      }
      if (draggedIndex > targetIndex && draggedTop > targetCenter){
        return;
      }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);

      item.index = targetIndex;
      item.listIndex = targetListIndex;
      


    },
  });

  dragRef(dropRef(ref));

  return (
    <Container ref={ref} isDragging={isDragging}>
      <header>
        {data.labels.map((label) => (
          <Label key={label} color={label} />
        ))}
      </header>
      <p>{data.content}</p>
      {data.user && <img src={data.user} alt="Avatar"></img>}
    </Container>
  );
}

export default Card;
