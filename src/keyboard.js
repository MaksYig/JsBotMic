const kb = require ('./keyboard_btn');

module.exports = {
  home:[
    [kb.home.windows],
    [kb.home.office],
    [kb.home.activation],
  ],
  windows:[
    [kb.windows.install],
    [kb.windows.update],
    [kb.backHome]
  ],
  office:[
    [kb.office.install],
    [kb.office.outlook],
    [ kb.backHome],
  ],
  activaion:[
    [kb.activaion.office],
    [kb.activaion.windows],
    [kb.backHome],
  ]

};