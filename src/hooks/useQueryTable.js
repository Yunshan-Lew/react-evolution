import { useState, useEffect } from 'react';
import config from '@/config';

function useQueryTable(form, queryFn){
  let [force, forceUpdate ] = useState(false)
  let [ pageIndex, setPageIndex ] = useState(1)
  let [ pageSize, setPageSize ] = useState(config.pageSize)

  useEffect(queryFn, [ force ])

  function handleChange(i, s){
		setPageIndex(i)
		setPageSize(s)
    forceUpdate(!force)
	}

	function handleSearch(val){
    setPageIndex(val)
    forceUpdate(!force)
	}

  function resetTable(){
    form.resetFields()
		setPageIndex(1)
    forceUpdate(!force)
	}

   /* 组合暴露参数 */
   return [
    {
      pageIndex,
      pageSize
    },
    {
      handleChange,
      handleSearch,
      resetTable
    }
  ]
}

export { useQueryTable }
