import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { message } from 'antd';
import config from '@/config';
import { toQueryString, parseQueryString } from '@/utils/toQueryString';

const dataSign = 'todo_list';

function useWaitTable(form, todoType, actions){
  let history = useHistory()
  let [ requsting, requstingUpdate ] = useState(false)
  let pagination = useRef({
    pageIndex: 1,
    pageSize: config.pageSize || 15
  })
  let { AjaxList, AjaxSystem } = actions

  useEffect(() => {
    let query = parseQueryString()
    query.pageIndex ? handleSearch(Number(query.pageIndex)) : resetTable()
  }, []) // eslint-disable-line

  function handleChange(i, s){
    pagination.current.pageIndex = i
    pagination.current.pageSize = s
    pullData()
	}

	function handleSearch(val){
    pagination.current.pageIndex = val
    pullData()
	}

  function pullData(){
    let { pageSize, pageIndex } = pagination.current
    let postData = { ...form.getFieldsValue(), todoType, pageSize, pageIndex }
    requstingUpdate(true)
		AjaxList({
			url: '/todo/todo/list/new',
			method: 'post',
			data: postData,
      sign: dataSign,
      contentType: 'application/json',
			success: res => {
        requstingUpdate(false)
        let query = parseQueryString()
        history.replace({ search: '?' + toQueryString({ ...query, pageIndex }) })
      },
			fail: res => {
				requstingUpdate(false)
				message.error(res.message)
			}
		})
	}

  function resetTable(){
    form.resetFields()
    pagination.current.pageIndex = 1
    pullData()
	}

  function getProcessNodes(){
    AjaxSystem({
			url: '/todo/todo/options/processNode',
			sign: 'process_nodes',
			fail: err => console.error(err)
		})
  }

   /* 组合暴露参数 */
   return [
    {
      requsting,
      ...pagination.current
    },
    {
      handleChange,
      handleSearch,
      resetTable,
      getProcessNodes
    }
  ]
}

export { useWaitTable }
