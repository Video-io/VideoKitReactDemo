import { useState, useEffect } from 'react';
import { SessionManager, SessionState, Playlist } from '@video-io/videokit'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  NavLink
} from 'react-router-dom';
import Player from './components/Player';
import Uplader from './components/Uploader';
import Feed from './components/Feed';
import './App.css';
import '@video-io/videokit/videokit.css'

const DEMO_APP_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2lkIjoiMW81cFBiVzMwNG44SXVwR2JVSm8iLCJyb2xlIjoiYXBwIiwiaWF0IjoxNjEyMTY2MzkwLCJpc3MiOiJ2aWRlby5pbyIsImp0aSI6ImZQN290S3dFb2V5U2tGNVNzQVBmLXdkaDU1In0.ebYY3nXYCyc9b8NuQZ742ejLEKsqxh0lZiK7FjtmKBM'

function App() {
  const [isVKReady, setVKReady] = useState(false)
  const [playlist, setPlaylist] = useState<Playlist>()

  useEffect(function() {
    async function startSession() {
      let state: SessionState = SessionManager.state

      if (state !== SessionState.CONNECTED) {
        state = await SessionManager.startSession({
          appToken: DEMO_APP_TOKEN,
          identity: 'test'
        })
      }

      if (state === SessionState.CONNECTED) {
        setVKReady(true)
        setPlaylist(new Playlist())
      }
    }

    startSession()
  }, [])

  if (!isVKReady) return null

  return (
    <div className="app">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <NavLink to="/player">Player</NavLink>
              </li>
              <li>
                <NavLink to="/feed">Feed</NavLink>
              </li>
              <li>
                <NavLink to="/uploader">Uploader</NavLink>
              </li>
            </ul>
          </nav>
          <main>
            <Switch>
              <Route exact path="/">
                <Redirect to="/player" />
              </Route>
              <Route path="/player">
                <Player playlist={playlist} />
              </Route>
              <Route path="/feed">
                <Feed playlist={playlist} />
              </Route>
              <Route path="/uploader">
                <Uplader />
              </Route>
            </Switch>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;
