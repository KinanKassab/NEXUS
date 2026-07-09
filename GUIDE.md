# NEXUS — Player Guide

Welcome to the NEXUS escape-room game. Your mission spans **3 web sites**, each representing a
different system inside the NEXUS facility. You must work through Sites 1 and 2 to obtain a
**Recovery Access Code**, then use it at Site 3 to complete the mission.

You do **not** need to complete both Site 1 and Site 2 — either one gives you the final code.
Start wherever you feel comfortable.

---

## How hints work

Each puzzle has **3 hint levels**. Read only as far as you need:

- **Hint 1** — gentle nudge, keeps most of the mystery alive
- **Hint 2** — stronger clue, points you in the right direction
- **Hint 3** — near-complete answer, only the final step left to you

Spoilers are hidden behind `> ` blockquotes so you can stop reading at any time.

---

## Site 1 — Log Explorer

**What you're looking at:** A Windows Explorer-style file browser showing the NEXUS Power
Distribution Core log archive (`\\NEXUS\logs\pdc`). Something is wrong with the core, and
someone needs to authenticate and fix it.

### Puzzle: Server Console authentication

When you open the **Server Console** (button in the top-right or the sidebar), a terminal
appears asking you to enter the *last-known-good core build signature* in binary form.

**Your job:** Find that signature value and type it into the console.

---

#### Hint 1

> The log files in the file list are readable. Try opening them by **double-clicking** (or
> single-clicking on mobile). At least one of them mentions signatures.

#### Hint 2

> There is a file called `build_manifest.log`. Open it and look for a field called
> `last_known_good_sig`. That is the value the console is asking for.

#### Hint 3

> Open `build_manifest.log`. You will see a line like:
>
> ```
> last_known_good_sig  = 01000010 00110010
> ```
>
> Type that binary value exactly into the **sig ›** field in the Server Console and press
> **EXECUTE**. Spaces are ignored, so you can type it with or without them.

---

## Site 2 — Kali Terminal

**What you're looking at:** A fully functional Kali Linux terminal emulator. You are logged in
as `kali` on a machine inside the NEXUS facility network. Somewhere on the network there is an
insecure device that needs to be found, connected to, and **hardened**.

Type `help` at any time to see available commands. Use the **↑ / ↓ arrow keys** to scroll
through your command history.

### Puzzle: Find and secure the Orchid Substation device

The goal is to locate a device on the network, gain access to it, fix its security issues, and
run the command that re-establishes an encrypted connection to the NEXUS server.

---

#### Hint 1 — Find the device

> Your machine is connected to the `10.8.0.x` subnet. Use a **network scanning tool** to find
> out what other hosts are on the network and what ports they have open.

#### Hint 2 — Find the device

> Run `nmap 10.8.0.66`. You will see that the host has **port 23 (telnet) open**. Telnet is an
> old, unencrypted protocol — that is your way in.

#### Hint 3 — Find the device

> Run this command to connect:
>
> ```
> telnet 10.8.0.66
> ```
>
> You will be dropped into the device's `legacy-ctrl` interface.

---

#### Hint 1 — Exploit and harden the device

> Once you are connected (the prompt changes to `device>`), explore the device. Type `help` or
> `?` to see what commands are available. Look at the current security status.

#### Hint 2 — Exploit and harden the device

> Run `status` to see the device's current security problems. There are **three issues** shown
> with `[!]` markers. You need to fix all of them before the `secure` command will work.
> Run `show cred` to see the current credentials.

#### Hint 3 — Exploit and harden the device

> Run these commands in order, inside the device session:
>
> ```
> show cred          ← see the factory-default password
> passwd newpass123  ← change the password to anything other than the default
> proto off          ← disable the unauthenticated legacy protocol
> secure             ← re-establish an encrypted uplink
> ```
>
> Replace `newpass123` with any password you like — it just cannot be the factory default.
> After `secure` succeeds, the **Recovery Access Code** is displayed on screen.

---

## Site 3 — Emergency Panel

**What you're looking at:** The final control panel for the NEXUS Emergency & Control Centre.
It requires a **Recovery Access Code** that you obtained by completing Site 1 or Site 2.

### Puzzle: Enter the recovery code

---

#### Hint 1

> You should already have the code from one of the earlier sites. Look back at your terminal
> output (Site 2) or the Server Console success screen (Site 1).

#### Hint 2

> The code was displayed in a highlighted box after you successfully completed the puzzle on
> Site 1 or Site 2. It is a short alphanumeric code that starts with `NX-`.

#### Hint 3

> The code is the one you collected from Site 1 or Site 2. Type it into the **Recovery Access
> Code** field and click **تحقّق ودخول** (Verify & Enter). The final destination of the mission
> will then be revealed.

---

## Quick-reference command list (Site 2)

| Command | What it does |
|---|---|
| `help` | Show built-in bash help |
| `ifconfig` | Show your IP address |
| `nmap <ip>` | Scan a host for open ports |
| `ping <ip>` | Test connectivity to a host |
| `telnet <ip>` | Connect via Telnet |
| `nc <ip> <port>` | Connect via Netcat |
| `man <tool>` | Show manual page for a tool |
| `history` | Show command history |
| `clear` | Clear the terminal |
| **Inside device session** | |
| `help` / `?` | Show device command list |
| `status` | Show current security status |
| `show cred` | Show current credentials |
| `passwd <newpass>` | Change the uplink password |
| `proto off` | Disable legacy protocol |
| `secure` | Re-establish encrypted uplink |
| `exit` | Disconnect from device |

---

*Good luck — the city is counting on you.*
