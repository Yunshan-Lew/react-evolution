import { useState, useEffect } from 'react';

function useTableHeight(v = 390){
  let [ tableHeight, setTableHeight ] = useState(550)

  useEffect(() => {
    let { clientHeight } = document.body
    setTableHeight(clientHeight - v)
  }, [ v ])

  return [ tableHeight ]
}

export { useTableHeight }
