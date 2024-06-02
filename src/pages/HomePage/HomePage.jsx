import logo from '../../imgs/logo/appLogo.webp'

import { goToHref } from '../../js/utils/href'

import './HomePage.css'

export default function HomePage() {
  return (
    <>
      <div className="pos_full_page home_page d_f_ce list_y">
        <div>
          <img src={logo} alt="Logo" />
          <div
            className="con home_page_play_btn fz_medium scale_trns cur_pointer"
            onClick={() => goToHref('/games')}
          >
            Play
          </div>
        </div>
      </div>
    </>
  )
}