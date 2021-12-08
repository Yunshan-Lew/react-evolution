import React, { useEffect } from 'react';

function PageMain(props) {
  useEffect(() => {
    document.title = '首页'
  })

  return <div className="page-wrap">
    <h1>This is main page</h1>
  </div>
}

export default PageMain
