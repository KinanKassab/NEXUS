# Site 2 — Field Terminal Station

> You are now inside a Kali Linux terminal.
> Somewhere on this network, a substation has been left wide open.
> Your job: find it, get in, and lock it down before someone else does.

---

## How to Read These Hints

These are not steps. They are nudges.
Each hint points you toward the *next thing to think about*, not the next command to type.
If you want the full experience, read one hint at a time — only when you're stuck.

---

## Hint 1 — Know Your Own Address

Before you reach out to anything, you need to know where *you* are.
Every machine on a network has an identity.
There is a command that shows you your network interfaces and their addresses.
Find yours.

<details>
<summary>I'm still stuck on this one</summary>

You're looking for your IP address on the local network.
Think about commands that display network configuration.
What tool do network administrators use to inspect interfaces?

</details>

---

## Hint 2 — Something Is Out There

You know your address. Now look around.
There is a device on this network — it has an address that ends in `.66`.
Before you can connect to it, you should know what it has open.
Security professionals have a specific tool for exactly this kind of reconnaissance.

<details>
<summary>I'm still stuck on this one</summary>

You want to see the open ports on a remote machine.
The tool is named after a well-known network exploration utility.
Look at the help menu — there is a command there that maps what's available.

</details>

---

## Hint 3 — A Door From Another Era

The scan results told you something important.
One of the open ports runs a protocol that predates the modern web.
It was designed for simple, direct connections to remote devices.
It is not SSH. It is older than that.
Use it.

<details>
<summary>I'm still stuck on this one</summary>

You are looking at two open ports.
The first one, port 23, runs a protocol that was the standard before SSH existed.
The `help` command lists how to open a connection.

</details>

---

## Hint 4 — Read the Room

You are inside the device now.
Do not rush. A good operator always assesses the situation first.
Ask the device what is wrong with it.
It will tell you exactly what needs to be fixed — and in what order.

<details>
<summary>I'm still stuck on this one</summary>

There is a command that shows the security status of the device.
Think: what do you call a command that gives you information or a status report?
The help menu inside the device will point you to it.

</details>

---

## Hint 5 — The Password Is Right There

This device was set up carelessly.
Its credentials were never changed from the factory default.
Someone left them visible.
Read them.

<details>
<summary>I'm still stuck on this one</summary>

There is a command that shows the current login credentials.
Think about what you'd call a command that retrieves or displays a password.
Check the device's help menu.

</details>

---

## Hint 6 — A New Key

A default password is no password at all.
Anyone who has ever worked with this type of device would know it.
Replace it with something — anything — that is not what was there before.

<details>
<summary>I'm still stuck on this one</summary>

You need to change the password.
The command name should suggest "change password" or "password."
It takes one argument: your new password.
Just don't use the old one.

</details>

---

## Hint 7 — Shut the Open Door

Changing the password is not enough.
There is still a channel that accepts connections without asking for one.
That is what made this device so easy to get into in the first place.
Close it.

<details>
<summary>I'm still stuck on this one</summary>

You are looking for a command that disables or closes an open channel or protocol.
Think about what you'd do to turn something off.
The `info` output told you what the problem was — the command name mirrors the solution.

</details>

---

## Hint 8 — Lock It Down

The password is changed.
The open channel is closed.
There is one final command that finishes the job — it encrypts the connection and marks the device as secured.
When it runs successfully, your mission code will appear on screen.

<details>
<summary>I'm still stuck on this one</summary>

The final command seals the device.
Think about a word that means "secure" or "lock."
It must be the *last* step — the device will refuse to run it until the previous two steps are done.

</details>

---

## After You Get the Code

The code you receive here is not the end.
It belongs somewhere else — another site, another panel.
The missions are connected.

---

*NEXUS Field Operations — Terminal Division*
