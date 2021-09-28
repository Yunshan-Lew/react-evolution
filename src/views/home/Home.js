import { useMemo } from 'react'
import { Link, withRouter } from 'react-router-dom';
import logo from '@/assets/logo.svg';
import './Home.less';

function Home(props) {
  let href = useMemo(() => {
		let { pathname } = props.location
		return pathname === '/home/page1' ? 'page2' : 'page1'
	}, [props.location])

  return (
    <div className="App">
      <header className="App-header">
        <img src={ logo } className="App-logo" alt="logo" />
        <Link style={{ color: '#fff' }} to={ `/home/${ href }` }>前往{ href }</Link>
        <div>
          { props.children }
        </div>
      </header>
    </div>
  );
}

export default withRouter(Home);
