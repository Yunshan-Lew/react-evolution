import React, { useEffect } from 'react';

function Page403(props) {
  useEffect(() => {
    document.title = '403'
  })

  return <div className="page-wrap">
    <h1>403 Forbidden</h1>
  </div>
}

export default Page403
