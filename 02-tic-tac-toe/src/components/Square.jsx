export const Square = ({children, isSelected, updateBoard, index})=>{
  // el componente square indica las acciones
  const className= `square ${isSelected ? 'is-selected' : ''}`
  
  //la funcion ejecuta la funcion que se paso como parametro(updateBoard)
  const handleClick = ()=>{
    updateBoard(index);
  }

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}
