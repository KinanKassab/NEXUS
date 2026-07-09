(function () {
  'use strict';

  var CONFIG = {
    targetIp:    '10.8.0.66',
    serverIp:    '10.8.0.2',
    oldPassword: 'relay-default',
    finalCode:   'NX-7C4E'
  };

  /* ── State ── */
  var state = {
    mode:         'local',
    cwd:          '~',
    history:      [],
    histIdx:      0,
    devPwChanged: false,
    devProtoOff:  false,
    devSecured:   false
  };

  /* ── DOM refs ── */
  var termBody      = document.getElementById('term-body');
  var termOutput    = document.getElementById('term-output');
  var localPrompt   = document.getElementById('local-prompt');
  var devicePrompt  = document.getElementById('device-prompt');
  var localInput    = document.getElementById('local-input');
  var deviceInput   = document.getElementById('device-input');
  var cwdLabel      = document.getElementById('cwd-label');
  var termTitle     = document.getElementById('term-title');

  /* ── Init ── */
  appendSegs([{ text: 'Last login: Wed Jul  8 02:31:14 2026 on tty1', cls: 'c-gray' }]);
  updateUI();
  getActiveInput().focus();

  /* ── Focus ── */
  termBody.addEventListener('click', function () { getActiveInput().focus(); });

  function getActiveInput() {
    return state.mode === 'device' ? deviceInput : localInput;
  }

  /* ── Scroll ── */
  function scrollBottom() {
    termBody.scrollTop = termBody.scrollHeight;
  }

  /* ── Output helpers ── */
  function appendSegs(segs) {
    var div = document.createElement('div');
    div.className = 'tline';
    if (!segs || !segs.length) {
      div.innerHTML = ' ';
    } else {
      segs.forEach(function (sg) {
        var span = document.createElement('span');
        if (sg.cls) span.className = sg.cls;
        else if (sg.color) span.style.color = sg.color;
        span.textContent = sg.text;
        div.appendChild(span);
      });
    }
    termOutput.appendChild(div);
    scrollBottom();
  }

  function print(text, cls) {
    String(text).split('\n').forEach(function (line) {
      appendSegs([{ text: line === '' ? ' ' : line, cls: cls || 'c-default' }]);
    });
  }

  /* ── Echo the prompt + command into output ── */
  function echoPrompt(cmd) {
    if (state.mode === 'device') {
      appendSegs([
        { text: 'device> ', cls: 'c-yellow' },
        { text: cmd,        cls: 'c-default' }
      ]);
    } else {
      var cwd = state.cwd || '~';
      appendSegs([
        { text: '┌──(', cls: 'c-blue' },
        { text: 'kali㉿kali', cls: 'c-white' },
        { text: ')-[', cls: 'c-blue' },
        { text: cwd, cls: 'c-blue' },
        { text: ']', cls: 'c-blue' }
      ]);
      appendSegs([
        { text: '└─$ ', cls: 'c-blue' },
        { text: cmd, cls: 'c-default' }
      ]);
    }
  }

  /* ── Update prompt UI ── */
  function updateUI() {
    cwdLabel.textContent = state.cwd;
    termTitle.textContent = 'kali@kali: ' + state.cwd;
    if (state.mode === 'device') {
      localPrompt.hidden  = true;
      devicePrompt.hidden = false;
    } else {
      localPrompt.hidden  = false;
      devicePrompt.hidden = true;
    }
    scrollBottom();
  }

  /* ── Run a command string ── */
  function run(raw) {
    var cmd = (raw || '').trim();
    echoPrompt(cmd);

    if (cmd !== '') {
      state.history.push(cmd);
      state.histIdx = state.history.length;

      var patch = state.mode === 'device' ? doDevice(cmd) : doLocal(cmd);

      if (patch && patch.clear) termOutput.innerHTML = '';
      if (patch && patch.state) Object.assign(state, patch.state);
    }

    updateUI();
    getActiveInput().focus();
  }

  /* ── Input key handler ── */
  function onKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var inp = getActiveInput();
      var val = inp.value;
      inp.value = '';
      run(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (state.histIdx > 0) {
        state.histIdx--;
        getActiveInput().value = state.history[state.histIdx] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      state.histIdx++;
      if (state.histIdx >= state.history.length) {
        state.histIdx = state.history.length;
        getActiveInput().value = '';
      } else {
        getActiveInput().value = state.history[state.histIdx] || '';
      }
    }
  }
  localInput.addEventListener('keydown', onKey);
  deviceInput.addEventListener('keydown', onKey);

  /* ── Helpers ── */
  function isIp(s) { return /^\d{1,3}(\.\d{1,3}){3}$/.test(s || ''); }

  /* ────────────────────────────────────────────────
     LOCAL SHELL COMMANDS
  ──────────────────────────────────────────────── */
  function doLocal(cmd) {
    var parts = cmd.split(/\s+/);
    if (parts[0] === 'sudo') parts = parts.slice(1);
    var c    = (parts[0] || '').toLowerCase();
    var args = parts.slice(1);
    var ip   = CONFIG.targetIp;

    if (c === 'scan')    c = 'nmap';
    if (c === 'check')   c = 'ping';
    if (c === 'myip')    c = 'ifconfig';
    if (c === 'connect') c = 'telnet';
    if (c === 'look')    c = 'ls';
    if (c === 'quit')    c = 'exit';

    switch (c) {
      case '': return;

      case 'help':
        print(
          'Commands\n'
        + '──────────────────────────────────────────────────\n'
        + '\n'
        + '  myip              See your IP address on the network.\n'
        + '  check <ip>        Check if a device is online.\n'
        + '  scan <ip>         Find all open ports on a device.\n'
        + '  connect <ip>      Open a connection to a device.\n'
        + '\n'
        + '  look              See files in the current folder.\n'
        + '  history           See the commands you typed before.\n'
        + '  clear             Clear the screen.\n'
        + '  help              Show this list.\n'
        + '  quit              Exit the terminal.\n'
        );
        return;

      case 'clear': return { clear: true };

      case 'ls':
        print('Desktop  Documents  Downloads  Pictures  tools');
        return;

      case 'pwd':
        print(state.cwd === '~' ? '/home/kali' : ('/home/kali/' + state.cwd.replace(/^~\//, '')));
        return;

      case 'cd': {
        var d = args[0];
        var cwd;
        if (!d || d === '~' || d === '/home/kali' || d === '..') cwd = '~';
        else cwd = '~/' + d.replace(/^~\//, '').replace(/^\//, '');
        return { state: { cwd: cwd } };
      }

      case 'whoami': print('kali'); return;
      case 'id':     print('uid=1000(kali) gid=1000(kali) groups=1000(kali),27(sudo)'); return;

      case 'history': {
        var h = state.history;
        print(h.length ? h.map(function (x, i) { return String(i + 1).padStart(4) + '  ' + x; }).join('\n') : '  (empty)');
        return;
      }

      case 'ifconfig': case 'ip':
        print(
        `Network Scan Results
        --------------------

        Network: 10.8.0.0/24

        10.8.0.1    - Gateway Router
        10.8.0.5    - Your Computer
        10.8.0.12   - Office Laptop
        10.8.0.23   - Printer
        10.8.0.41   - Security Camera
        10.8.0.55   - File Server
        10.8.0.66   - Unknown Device
        10.8.0.78   - Smart TV
        10.8.0.91   - NAS Storage
        10.8.0.104  - Developer PC

        10 devices found.`
        );   
        return;

      case 'man': {
        var m = args[0];
        var docs = {
          nmap:   'nmap(1) — Network exploration tool and security scanner\nUsage: nmap [scan-type] [options] {target}',
          nc:     'ncat(1) — concatenate and redirect sockets\nUsage: nc [options] host port',
          ncat:   'ncat(1) — concatenate and redirect sockets\nUsage: ncat [options] host port',
          telnet: 'telnet(1) — user interface to the TELNET protocol\nUsage: telnet host [port]',
          ping:   'ping(8) — send ICMP ECHO_REQUEST to network hosts\nUsage: ping [options] destination',
          ssh:    'ssh(1) — OpenSSH remote login client\nUsage: ssh [user@]hostname [command]'
        };
        print(m && docs[m] ? docs[m] : 'No manual entry for ' + (m || ''));
        return;
      }

      case 'which': case 'type': {
        var t = args[0] || '';
        var known = ['nmap','nc','ncat','telnet','ssh','ping','ls','cat','ifconfig'];
        print(known.indexOf(t) !== -1 ? '/usr/bin/' + t : t + ': not found');
        return;
      }

      case 'ping': {
        var tgt = args.find(function (a) { return !a.startsWith('-'); });
        if (!tgt) { print('Usage: check <address>'); return; }
        if (tgt === ip) {
          print('PING ' + ip + ' (' + ip + ') 56(84) bytes of data.\n'
              + '64 bytes from ' + ip + ': icmp_seq=1 ttl=64 time=1.82 ms\n'
              + '64 bytes from ' + ip + ': icmp_seq=2 ttl=64 time=1.55 ms\n'
              + '64 bytes from ' + ip + ': icmp_seq=3 ttl=64 time=1.66 ms\n'
              + '\n--- ' + ip + ' ping statistics ---\n'
              + '3 packets transmitted, 3 received, 0% packet loss, time 2003ms');
          return;
        }
        if (isIp(tgt)) {
          print('PING ' + tgt + ' (' + tgt + ') 56(84) bytes of data.\n'
              + 'From 10.8.0.5 icmp_seq=1 Destination Host Unreachable\n'
              + '\n--- ' + tgt + ' ping statistics ---\n'
              + '3 packets transmitted, 0 received, 100% packet loss');
          return;
        }
        print('Cannot find address: ' + tgt);
        return;
      }

      case 'nmap': {
        var nt = args.find(function (a) { return !a.startsWith('-') && isIp(a); });
        if (!nt) { print('Usage: scan <address>'); return; }
        if (nt === ip) {
          print('Starting Nmap 7.94 ( https://nmap.org )\n'
              + 'Nmap scan report for ' + ip + '\n'
              + 'Host is up (0.0017s latency).\n'
              + 'Not shown: 998 closed tcp ports (reset)\n'
              + 'PORT     STATE SERVICE\n'
              + '23/tcp   open  telnet\n'
              + '2323/tcp open  legacy-ctrl\n'
              + '\nNmap done: 1 IP address (1 host up) scanned in 1.71s');
          return;
        }
        print('Starting Nmap 7.94 ( https://nmap.org )\n'
            + 'Note: Host seems down. If it is really up, but blocking our ping probes, try -Pn\n'
            + 'Nmap done: 1 IP address (0 hosts up) scanned in 3.04s');
        return;
      }

      case 'nc': case 'ncat': case 'netcat': {
        var nchost = args.find(function (a) { return isIp(a); });
        var nums   = args.filter(function (a) { return /^\d+$/.test(a); });
        var port   = nums[nums.length - 1];
        if (!nchost || !port) { print('Usage: nc <address> <port>'); return; }
        if (nchost === ip && (port === '23' || port === '2323')) return connect();
        if (nchost === ip) { print('Connection refused.'); return; }
        print('Cannot reach that address.');
        return;
      }

      case 'telnet': {
        var th = args.find(function (a) { return isIp(a); });
        var tp = args.find(function (a) { return /^\d+$/.test(a); });
        if (!th) { print('Usage: connect <address>'); return; }
        if (th === ip && (!tp || tp === '23' || tp === '2323')) return connect();
        if (th === ip) { print('Connection refused.'); return; }
        print('Cannot find that address: ' + th);
        return;
      }

      case 'ssh': {
        var sg = args.find(function (a) { return !a.startsWith('-'); }) || '';
        var sh = sg.indexOf('@') !== -1 ? sg.split('@')[1] : sg;
        if (!sh) { print('Usage: ssh [user@]hostname'); return; }
        print('SSH is not available here — try  connect  instead.');
        return;
      }

      case 'cat': {
        var f = args[0];
        if (!f) { print('Usage: cat <file>'); return; }
        var dirs = ['desktop','documents','downloads','pictures','tools'];
        if (dirs.indexOf((f || '').toLowerCase()) !== -1) { print(f + ' is a folder, not a file.'); return; }
        print('File not found: ' + f);
        return;
      }

      case 'echo': print(args.join(' ')); return;

      case 'exit': case 'logout':
        print(' ');
        return;

      default:
        print('Unknown command: ' + c + '.  Type  help  to see what you can use.', 'c-red');
        return;
    }
  }

  /* ── Connect to device ── */
  function connect() {
    var ip = CONFIG.targetIp;
    print('Connecting to ' + ip + ' ...');
    print('Connected.');
    print('');
    print('=== ORCHID SUBSTATION — you are now inside the device ===', 'c-yellow');
    print('=== Warning: this device has no password protection      ===', 'c-yellow');
    print('');
    print('Type  help  to see what you can do here.', 'c-gray');
    print('');
    return { state: { mode: 'device', devPwChanged: false, devProtoOff: false, devSecured: false } };
  }

  /* ────────────────────────────────────────────────
     DEVICE MODE COMMANDS
  ──────────────────────────────────────────────── */
  function doDevice(cmd) {
    var parts = cmd.split(/\s+/);
    var c     = (parts[0] || '').toLowerCase();
    var args  = parts.slice(1);
    var old   = CONFIG.oldPassword;
    var srv   = CONFIG.serverIp;

    if (c === 'info')       c = 'status';
    if (c === 'lock')       c = 'secure';
    if (c === 'disconnect') c = 'exit';
    if (c === 'creds')      { c = 'show'; args = ['cred']; }
    if (c === 'getpass')    { c = 'show'; args = ['cred']; }
    if (c === 'changepass') c = 'passwd';

    switch (c) {
      case '': return;

      case 'help': case '?':
        print(
          'Commands  —  you are inside the Orchid Substation\n'
        + '──────────────────────────────────────────────────\n'
        + '\n'
        + '  info              See what security problems this device has.\n'
        + '  getpass           See the current login password.\n'
        + '  changepass <new>  Set a new password.\n'
        + '  disable           Close the old open connection channel.\n'
        + '  lock              Secure this device — your code will appear here.\n'
        + '\n'
        + '  whoami            See which account you are using.\n'
        + '  disconnect        Leave and go back to your terminal.\n'
        );
        return;

      case 'status':
        print('Security check — Orchid Substation\n'
            + '──────────────────────────────────────\n'
            + 'Connection to server  :  active\n'
            + 'Open channel          :  ' + (state.devProtoOff ? 'closed      ✓' : 'OPEN    [!]  anyone can connect') + '\n'
            + 'Encryption            :  ' + (state.devSecured  ? 'on          ✓' : 'OFF     [!]  data is not protected') + '\n'
            + 'Password              :  ' + (state.devPwChanged ? 'changed     ✓' : 'DEFAULT [!]  not safe'));
        return;

      case 'show': {
        var s = (args[0] || '').toLowerCase();
        if (s === 'cred' || s === 'creds') {
          print('Account   :  svc-relay\n'
              + 'Password  :  ' + (state.devPwChanged ? '(changed — hidden)' : old + '   ← this is the default password'));
          return;
        }
        if (s === 'uplink') {
          print('Server    :  ' + srv + '\nChannel   :  ' + (state.devSecured ? 'encrypted' : 'not encrypted  [!]'));
          return;
        }
        if (s === 'proto') {
          print('Open channel :  ' + (state.devProtoOff ? 'closed' : 'open  [!]  — no password needed to connect'));
          return;
        }
        if (s === 'link') {
          print('Physical connection :  active');
          return;
        }
        print('Type  info  to see the device status, or  help  for all commands.');
        return;
      }

      case 'set': {
        var k  = (args[0] || '').toLowerCase();
        var v  = args[1];
        var pkeys  = ['password','pass','cred.password','uplink.password'];
        var prkeys = ['proto','protocol','legacy'];
        var ekeys  = ['encryption','enc','tls','secure'];
        if (pkeys.indexOf(k) !== -1)  return setPass(v);
        if (prkeys.indexOf(k) !== -1) {
          var vv = (v || '').toLowerCase();
          if (vv === 'off') return protoOff();
          if (vv === 'on')  return protoOn();
          print('Usage: set proto <on|off>');
          return;
        }
        if (ekeys.indexOf(k) !== -1) {
          if ((v || '').toLowerCase() !== 'off') return trySecure();
          print('Encryption is already off.');
          return;
        }
        print('Unknown setting.  Type  help  to see what you can use.');
        return;
      }

      case 'passwd': case 'password': case 'pass':
        return setPass(args[0]);

      case 'proto': case 'protocol': case 'legacy': {
        var pv = (args[0] || '').toLowerCase();
        if (pv === 'off') return protoOff();
        if (pv === 'on')  return protoOn();
        print('Usage: proto <on|off>');
        return;
      }

      case 'disable': case 'close': return protoOff();

      case 'secure': case 'encrypt': case 'reconnect': case 'harden':
        return trySecure();

      case 'tls':
        if ((args[0] || '').toLowerCase() === 'off') { print('Encryption is already off.'); return; }
        return trySecure();

      case 'reboot':   print('Restarting ... done.'); return;
      case 'whoami':   print('svc-relay'); return;
      case 'uptime':   print('02:41:06 up 37 days,  4:12,  load average: 0.00, 0.01, 0.05'); return;
      case 'ls':       print('config  firmware  uplink'); return;
      case 'ping':     print('Ping is not available on this device.'); return;

      case 'exit': case 'quit': case 'logout':
        print('You left the device.', 'c-gray');
        return { state: { mode: 'local' } };

      default:
        print('Unknown command: ' + c + '.  Type  help  to see what you can use.', 'c-red');
        return;
    }
  }

  /* ── Device sub-commands ── */
  function setPass(v) {
    var old = CONFIG.oldPassword;
    if (!v) { print('Type  changepass  followed by your new password.  Example:  changepass abc123'); return; }
    if (v === old) { print('That is the same password. Please choose a different one.', 'c-yellow'); return; }
    print('Password changed.', 'c-green');
    return { state: { devPwChanged: true } };
  }

  function protoOff() {
    print('Open channel closed.', 'c-green');
    return { state: { devProtoOff: true } };
  }

  function protoOn() {
    print('Open channel turned back on.');
    return { state: { devProtoOff: false } };
  }

  function trySecure() {
    if (!state.devPwChanged) { print('Cannot do this yet — change the password first.  Use:  changepass <new password>', 'c-red'); return; }
    if (!state.devProtoOff)  { print('Cannot do this yet — close the open channel first.  Use:  disable', 'c-red'); return; }
    var srv = CONFIG.serverIp;
    print('Connecting to ' + srv + ' with encryption ... done');
    print('Encryption is now on.');
    print('Open channel is closed.');
    print('Password has been changed.');
    print('The device is now secure. Mission complete.', 'c-green');
    print('');
    print('YOUR CODE:  ' + CONFIG.finalCode, 'c-green');
    print('Enter this code at Site 3 — Emergency Panel.', 'c-gray');
    return { state: { devSecured: true } };
  }

})();
