-- Read the docs: https://www.lunarvim.org/docs/configuration
-- Video Tutorials: https://www.youtube.com/watch?v=sFA9kX-Ud_c&list=PLhoH5vyxr6QqGu0i7tt_XoVK9v-KvZ3m6
-- Forum: https://www.reddit.com/r/lunarvim/
-- Discord: https://discord.com/invite/Xb9B4Ny
--
local dap = require('dap')
  dap.configurations.python = {
    {
      type = 'python';
      request = 'launch';
      name = "Launch file";
      program = "${file}";
      pythonPath = '/usr/bin/python';
    },
  }

dap.adapters.python = {
    type = 'executable',
    command = 'python',
    args = {'-m', 'debugpy.adapter'}
}

