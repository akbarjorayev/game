import { useEffect, useRef } from 'react'

import Alert from '../../../components/Alert/Alert'
import Button from '../../../components/Button/Button'

import {
  deleteFromSession,
  loadFromSession,
} from '../../../js/db/local/sessionStorage'
import { rejectGame } from '../../../modules/game.module'
import { goToHref } from '../../../js/utils/href'
import { useFirebaseRealtime } from '../../../hooks/useFirebaseRealtime'
import { useCounter } from '../../../hooks/useCounter'
import { secondsTo } from '../../../js/utils/time'

export default function GamePageWaitingForRes({ name, link, onHide }) {
  const gameToken = useRef(loadFromSession('gameToken')).current
  const [isPlaying] = useFirebaseRealtime(`games/playing/${gameToken}/playing`)
  const [isDenied] = useFirebaseRealtime(`games/playing/${gameToken}/denied`)
  const [count] = useCounter(isPlaying === null)

  useEffect(() => {
    if (isPlaying) {
      deleteFromSession('gameLink')
      goToHref(link)
    }
  }, [isPlaying])

  async function stopGame() {
    onHide()
    await rejectGame(gameToken)
  }

  if (isDenied === null)
    return (
      <Alert onHide={stopGame}>
        <div className="list_y">
          <div className="txt_ce">
            <b>{name}</b> <span className="txt_red">denied</span> your request
          </div>
        </div>
      </Alert>
    )

  return (
    <Alert onHide={stopGame}>
      <div className="list_y">
        <div className="txt_ce">
          You're waiting for <b>@{name}</b> response for{' '}
          <b>{secondsTo(count)}</b>
        </div>
        <Button className="btn_bd txt_red" onClick={stopGame}>
          Stop waiting
        </Button>
      </div>
    </Alert>
  )
}
