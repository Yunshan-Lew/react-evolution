import { useState, useEffect } from 'react';
import { message } from 'antd';
import config from '@/config';

const dataSign = 'todo_list';

function useWaitTable(form, todoType, actions){
  let [ requsting, requstingUpdate ] = useState(false)
  let [ pageIndex, setPageIndex ] = useState(1)
  let [ pageSize, setPageSize ] = useState(config.pageSize)
  let [ force, forceUpdate ] = useState(false)
  let { AjaxList, AjaxSystem } = actions

  useEffect(pullData, [ force ]) // eslint-disable-line

  function handleChange(i, s){
		setPageIndex(i)
		setPageSize(s)
    forceUpdate(!force)
	}

	function handleSearch(val){
    setPageIndex(val)
    forceUpdate(!force)
	}

  function pullData(){
    if( requsting ) return
    let postData = { ...form.getFieldsValue(), todoType, pageSize, pageIndex }
    requstingUpdate(true)
		AjaxList({
			url: '/todo/todo/list/new',
			method: 'post',
			data: postData,
      sign: dataSign,
      contentType: 'application/json',
			success: res => requstingUpdate(false),
			fail: res => {
				requstingUpdate(false)
				message.error(res.message)
			}
		})
	}

  function resetTable(){
    form.resetFields()
		setPageIndex(1)
    forceUpdate(!force)
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
      pageIndex,
      pageSize
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
