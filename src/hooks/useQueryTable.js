import { useRef } from 'react';
import config from '@/config';

function useQueryTable(form, queryFn){
  let pagination = useRef({
    pageIndex: 1,
    pageSize: config.pageSize || 15
  })

  function handleChange(i, s){
		pagination.current.pageIndex = i
		pagination.current.pageSize = s
    let { current } = pagination
    queryFn(current)
	}

	function handleSearch(val){
    pagination.current.pageIndex = val
    let { current } = pagination
    queryFn(current)
	}

  function resetTable(){
    form.resetFields()
    pagination.current.pageIndex = 1
    let { current } = pagination
    queryFn(current)
	}

   /* 组合暴露参数 */
   return [
    {
      ...pagination.current
    },
    {
      handleChange,
      handleSearch,
      resetTable
    }
  ]
}

export { useQueryTable }
