import { useContext, useEffect, useRef, useState } from 'react'

import Button from '../../../components/Button/Button'

import { NotificationsContext } from '../NotificationsContext'
import { removeNotification } from '../../../modules/notifications.module'
import { NOTIFICATIONS_TYPES } from '../data/notificationsData'
import { acceptGame, endGame } from '../../../modules/game.module'
import { goToHref } from '../../../js/utils/href'

export default function NotificationsItem({ data }) {
  const { notifications, setNotifications } = useContext(NotificationsContext)
  const date = useRef(new Date(data.date))
  const [remove, setRemove] = useState(false)

  useEffect(() => {
    async function removeN() {
      if (remove) {
        const newNs = await removeNotification(data.id)
        setNotifications({ ...notifications, notifications: newNs })

        data.removed = true
        setRemove(false)
      }
    }
    removeN()
  }, [remove, data, notifications, setNotifications])

  function swipe(e) {
    if (e.deltaX > 50 && !remove) setRemove(true)
  }

  async function deny() {
    if (data?.type === NOTIFICATIONS_TYPES.playReqs) {
      setRemove(true)
      await endGame(data.gameToken)
    }
  }

  async function accept() {
    if (data?.type === NOTIFICATIONS_TYPES.playReqs) {
      setRemove(true)
      await acceptGame(data.gameToken)
      goToHref(data.gameLink)
    }
  }

  return (
    <>
      <div
        className="con blur_theme_bg notification_item list_y"
        onWheel={swipe}
        removed={remove ? 'removed' : ''}
        new={data.new ? 'new' : ''}
      >
        <div className="d_f_jc_sb">
          <div>
            <b>{data?.title}</b>
            <div className="fz_small">{data?.description}</div>
          </div>
          <div className="fz_small txt_opa">
            {date.current.getHours()}:{date.current.getMinutes()}
          </div>
        </div>
        {data.type === NOTIFICATIONS_TYPES.playReqs && (
          <>
            <div className="line_x"></div>
            <div className="list_x w_100_child">
              <Button className="txt_red" onClick={deny}>
                Deny
              </Button>
              <Button className="btn_cl" onClick={accept}>
                Accept
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
