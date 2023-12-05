---
layout: member.webc
pagination:
  data: beancounter.users
  size: 1
  alias: member
  resolve: values
permalink: 'share/{{ member.username | hash }}/index.html'
---
