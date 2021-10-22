import { useState, useEffect } from 'react';

function useTableHeight(){
  let [ tableHeight, setTableHeight ] = useState(550)

  useEffect(() => {
    let { clientHeight } = document.body
    setTableHeight(clientHeight - 390)
  }, [])

  return [ tableHeight ]
}

export { useTableHeight }
