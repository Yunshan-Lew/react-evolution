import { useState } from 'react';
import config from '@/config';

function useQueryTable(form, queryFn){
  let [ pageIndex, setPageIndex ] = useState(1)
  let [ pageSize, setPageSize ] = useState(config.pageSize)

  function handleChange(i, s){
		setPageIndex(i)
		setPageSize(s)
		queryFn()
	}

	function handleSearch(val){
    setPageIndex(val)
		queryFn()
	}

  function resetTable(){
    form.resetFields()
		setPageIndex(1)
    queryFn()
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
