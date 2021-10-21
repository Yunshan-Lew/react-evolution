import { useState, useEffect, useRef, useCallback } from 'react';
import config from '@/config';

function useQueryTable(defaultQuery = {}, api){
  const formData = useRef({})
  const pagination = useRef({
    pageIndex: defaultQuery.pageIndex || 1,
    pageSize: defaultQuery.pageSize || config.pageSize
  })

  const [, forceUpdate] = useState(null)

  const getList = useCallback(function(){
    if( !api ) return
    pagination.current.pageIndex = 1
    api()
  }, [ api ])

  const setFormItem = useCallback(function(key,value){
    const form = formData.current
    form[key] = value
    forceUpdate({})
  }, [])

  const reset = useCallback(function(){
    const current = formData.current
    for (let key in current) {
      current[key] = ''
    }
    pagination.current.pageIndex = defaultQuery.pageIndex || 1
    pagination.current.pageSize = defaultQuery.pageSize || config.pageSize
    console.log(pagination.current)
    getList()
  },[ getList ])

  const handleChange = useCallback(function(pageIndex, pageSize){
    pagination.current = { pageIndex, pageSize }
    getList()
  }, [ getList ])

   /* 组合暴露参数 */
   return [
    {  /* 组合表格状态 */
      handleChange,
      getList,
      pagination: pagination.current
    },
    {  /* 组合搜索表单状态 */
      formData: formData.current,
      setFormItem,
      reset
    }
  ]
}

export { useQueryTable }
