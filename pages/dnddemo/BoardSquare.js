import { canMoveKnight, moveKnight } from './dnd'
import { ItemTypes } from './Constants'
import { useDrop } from 'react-dnd'

// stage
const Square=({ black, children })=> {
    const fill = black ? 'black' : 'white'
    const stroke = black ? 'white' : 'black'
    return (
        <div
          style={{
            backgroundColor: fill,
            color: stroke,
            width: '100%',
            height: '50px'
          }}
        >
          {children}
        </div>
      )
  }

export default function BoardSquare({ x, y, setKnightPosition,children }){
    const black = (x + y) % 2 === 1
    const [{ isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.KNIGHT,
      drop: () => setKnightPosition([x, y]),
      collect: monitor => ({
        isOver: !!monitor.isOver(),
      }),
    }), [x, y])
  
    return (
      <div
        ref={drop}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <Square black={black}>{children}</Square>
        {isOver && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              zIndex: 1,
              opacity: 0.5,
              backgroundColor: 'yellow',
            }}
          />
        )}
      </div>
    )
  }
