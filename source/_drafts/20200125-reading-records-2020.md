---
title: 2021-01-22 16:04:03
date: 2021-01-22 16:04:08
id: reading-records-2020
categories: ['生活']
tags:
keywords:
description:
---

1213

123123123

<!-- more -->

ssssss

```mermaid
%%{init: {'theme':'forest'}}%%
graph LR
  classDef strong fill:#f96;

	App --> a1[A] --> x1[X v1.01] --> a --> ax --> axc --> a25
	App --> b1[B] --> x2[X v2.0]:::strong
```

```ts
interface Loclas {
  page: {
    title: string;
    date: Moment;
    comments: boolean;
    raw: string;
    updated: Moment;
    // aaa/bbb/cccc.html
    path: string;
    layout: string;
    // html string
    content: string;
    site: { data: {} };
    // 摘要
    excerpt: string;
    // 文章 more 部分
    more: string;
    // https://xx.com/a/x.html
    permalink: string;
    // xx.md
    source: string;
    // local md path
    full_source: string;
    lang: string;
    // xx.html
    canonical_path: string;

    _id: string;
    // html string
    _content: string;
    __page: boolean;
  };
}
```
