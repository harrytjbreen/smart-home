import * as React from "react"
import {CSSProperties, useState} from "react";

type Position = [number, number]

interface Props {
    initialPosition: Position;
}

const dragImg = new Image(0,0);

const Draggable: React.FC<Props> = ({initialPosition, children}) => {

  const [position, setPosition] = useState<Position>(initialPosition);
  const [offset, setOffset] = useState<Position>([0,0]);

  const onDrag = (e: any) => {
    if(!e.clientX && !e.clientY) return;
    setPosition([e.clientY - offset[0], e.clientX - offset[1]])
  }

  const onClick = (e: any) => {
    e.dataTransfer.setDragImage(dragImg,0,0);
    setOffset([e.clientY-position[0], e.clientX-position[1]]);
  }

  const Style: CSSProperties = {
    top: position[0],
    left: position[1],
  }

  return (
    <div draggable id={"draggable"} className={"draggable"} onDragStart={onClick} onDrag={onDrag} style={Style}>
      {children}
    </div>
  )
}

export default Draggable;
