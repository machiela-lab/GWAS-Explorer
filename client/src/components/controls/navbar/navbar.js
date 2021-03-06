import React from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.scss';

export function Navbar({ links }) {
  return (
    <div className="bg-primary text-white shadow-sm">
      {/* for desktops */}
      <div className="px-0 d-none d-lg-block">
        <div className="ml-3">
          {[{ route: '/', title: 'Home', exact: true }]
            .concat(links)
            .filter(link => link.title)
            .sort((a, b) => a.navIndex - b.navIndex)
            .map(({ route, action, title, exact }, index) => (
              <div data-testid="Navbar" className="d-inline-block" key={title}>
                <NavLink
                  data-testid={`Navbar-NavLink-${index}`}
                  // key={title}
                  className="navlinks py-2 px-4 d-inline-block"
                  activeClassName="active-navlinks"
                  exact={exact}
                  to={route}>
                  {action} {title}
                </NavLink>
                <div className="d-lg-none w-100"></div>
              </div>
            ))}
          {/* <pre>{JSON.stringify(links)}</pre> */}
        </div>
      </div>
      {/* for mobile devices  */}
      <div className="row px-0 d-lg-none">
        {[{ route: '/', title: 'Home', exact: true }]
              .concat(links)
              .filter(link => link.title)
              .sort((a, b) => a.navIndex - b.navIndex)
              .map(({ route, action, title, exact }, index) => (
                <div data-testid="Navbar" className="col-12" key={title}>
                  <NavLink
                    data-testid={`Navbar-NavLink-${index}`}
                    // key={title}
                    className="navlinks py-2 w-100 d-inline-block text-center"
                    activeClassName="active-navlinks"
                    exact={exact}
                    to={route}>
                    {action} {title}
                  </NavLink>
                  <div className="d-lg-none w-100"></div>
                </div>
              ))}
      </div>
    </div>
  );
}
