  // empty string
  testServerTimingHeader("", {});

  // name only
  testServerTimingHeader("metric", {{"metric", "0", ""}});

  // name and duration
  testServerTimingHeader("metric;dur=123.4", {{"metric", "123.4", ""}});
  testServerTimingHeader("metric;dur=\"123.4\"", {{"metric", "123.4", ""}});

  // name and description
  testServerTimingHeader("metric;desc=description", {{"metric", "0", "description"}});
  testServerTimingHeader("metric;desc=\"description\"", {{"metric", "0", "description"}});

  // name, duration, and description
  testServerTimingHeader("metric;dur=123.4;desc=description", {{"metric", "123.4", "description"}});
  testServerTimingHeader("metric;desc=description;dur=123.4", {{"metric", "123.4", "description"}});

  // special chars in name
  testServerTimingHeader("aB3!#$%&'*+-.^_`|~", {{"aB3!#$%&'*+-.^_`|~", "0", ""}});

  // delimiter chars in quoted description
  testServerTimingHeader("metric;desc=\"descr;,=iption\";dur=123.4", {{"metric", "123.4", "descr;,=iption"}});

  // spaces
  testServerTimingHeader("metric ; ", {{"metric", "0", ""}});
  testServerTimingHeader("metric , ", {{"metric", "0", ""}});
  testServerTimingHeader("metric ; dur = 123.4 ; desc = description", {{"metric", "123.4", "description"}});
  testServerTimingHeader("metric ; desc = description ; dur = 123.4", {{"metric", "123.4", "description"}});
  testServerTimingHeader("metric;desc = \"description\"", {{"metric", "0", "description"}});

  // tabs (known failures in chrome)
  //testServerTimingHeader("metric\t;\t", [{"name":"metric"}]);
  //testServerTimingHeader("metric\t,\t", [{"name":"metric"}]);
  //testServerTimingHeader("metric\t;\tdur\t=\t123.4\t;\tdesc\t=\tdescription", [{"name":"metric","dur":123.4,"desc":"description"}]);
  //testServerTimingHeader("metric\t;\tdesc\t=\tdescription\t;\tdur\t=\t123.4", [{"name":"metric","desc":"description","dur":123.4}]);
  //testServerTimingHeader("metric;desc\t=\t\"description\"", [{"name":"metric","desc":"description"}]);

  // multiple entries
  testServerTimingHeader("metric1;dur=12.3;desc=description1,metric2;dur=45.6;desc=description2,metric3;dur=78.9;desc=description3", {{"metric1", "12.3", "description1"}, {"metric2", "45.6", "description2"}, {"metric3", "78.9", "description3"}});
  testServerTimingHeader("metric1,metric2 ,metric3, metric4 , metric5", {{"metric1", "0", ""}, {"metric2", "0", ""}, {"metric3", "0", ""}, {"metric4", "0", ""}, {"metric5", "0", ""}});

  // quoted-strings - happy path
  testServerTimingHeader("metric;desc=\"description\"", {{"metric", "0", "description"}});
  testServerTimingHeader("metric;desc=\"\t description \t\"", {{"metric", "0", "\t description \t"}});
  testServerTimingHeader("metric;desc=\"descr\\\"iption\"", {{"metric", "0", "descr\"iption"}});

  // quoted-strings - others
  // metric;desc=\ --> ''
  testServerTimingHeader("metric;desc=\\", {{"metric", "0", ""}});
  // metric;desc=" --> ''
  testServerTimingHeader("metric;desc=\"", {{"metric", "0", ""}});
  // metric;desc=\\ --> ''
  testServerTimingHeader("metric;desc=\\\\", {{"metric", "0", ""}});
  // metric;desc=\" --> ''
  testServerTimingHeader("metric;desc=\\\"", {{"metric", "0", ""}});
  // metric;desc="\ --> ''
  testServerTimingHeader("metric;desc=\"\\", {{"metric", "0", ""}});
  // metric;desc="" --> ''
  testServerTimingHeader("metric;desc=\"\"", {{"metric", "0", ""}});
  // metric;desc=\\\ --> ''
  testServerTimingHeader("metric;desc=\\\\\\", {{"metric", "0", ""}});
  // metric;desc=\\" --> ''
  testServerTimingHeader("metric;desc=\\\\\"", {{"metric", "0", ""}});
  // metric;desc=\"\ --> ''
  testServerTimingHeader("metric;desc=\\\"\\", {{"metric", "0", ""}});
  // metric;desc=\"" --> ''
  testServerTimingHeader("metric;desc=\\\"\"", {{"metric", "0", ""}});
  // metric;desc="\\ --> ''
  testServerTimingHeader("metric;desc=\"\\\\", {{"metric", "0", ""}});
  // metric;desc="\" --> ''
  testServerTimingHeader("metric;desc=\"\\\"", {{"metric", "0", ""}});
  // metric;desc=""\ --> ''
  testServerTimingHeader("metric;desc=\"\"\\", {{"metric", "0", ""}});
  // metric;desc=""" --> ''
  testServerTimingHeader("metric;desc=\"\"\"", {{"metric", "0", ""}});
  // metric;desc=\\\\ --> ''
  testServerTimingHeader("metric;desc=\\\\\\\\", {{"metric", "0", ""}});
  // metric;desc=\\\" --> ''
  testServerTimingHeader("metric;desc=\\\\\\\"", {{"metric", "0", ""}});
  // metric;desc=\\"\ --> ''
  testServerTimingHeader("metric;desc=\\\\\"\\", {{"metric", "0", ""}});
  // metric;desc=\\"" --> ''
  testServerTimingHeader("metric;desc=\\\\\"\"", {{"metric", "0", ""}});
  // metric;desc=\"\\ --> ''
  testServerTimingHeader("metric;desc=\\\"\\\\", {{"metric", "0", ""}});
  // metric;desc=\"\" --> ''
  testServerTimingHeader("metric;desc=\\\"\\\"", {{"metric", "0", ""}});
  // metric;desc=\""\ --> ''
  testServerTimingHeader("metric;desc=\\\"\"\\", {{"metric", "0", ""}});
  // metric;desc=\""" --> ''
  testServerTimingHeader("metric;desc=\\\"\"\"", {{"metric", "0", ""}});
  // metric;desc="\\\ --> ''
  testServerTimingHeader("metric;desc=\"\\\\\\", {{"metric", "0", ""}});
  // metric;desc="\\" --> '\'
  testServerTimingHeader("metric;desc=\"\\\\\"", {{"metric", "0", "\\"}});
  // metric;desc="\"\ --> ''
  testServerTimingHeader("metric;desc=\"\\\"\\", {{"metric", "0", ""}});
  // metric;desc="\"" --> '"'
  testServerTimingHeader("metric;desc=\"\\\"\"", {{"metric", "0", "\""}});
  // metric;desc=""\\ --> ''
  testServerTimingHeader("metric;desc=\"\"\\\\", {{"metric", "0", ""}});
  // metric;desc=""\" --> ''
  testServerTimingHeader("metric;desc=\"\"\\\"", {{"metric", "0", ""}});
  // metric;desc="""\ --> ''
  testServerTimingHeader("metric;desc=\"\"\"\\", {{"metric", "0", ""}});
  // metric;desc="""" --> ''
  testServerTimingHeader("metric;desc=\"\"\"\"", {{"metric", "0", ""}});

  // duplicate entry names
  testServerTimingHeader("metric;dur=12.3;desc=description1,metric;dur=45.6;desc=description2", {{"metric", "12.3", "description1"}, {"metric", "45.6", "description2"}});

  // param name case sensitivity
  testServerTimingHeader("metric;DuR=123.4;DeSc=description", {{"metric", "123.4", "description"}});

  // non-numeric durations
  testServerTimingHeader("metric;dur=foo", {{"metric", "0", ""}});
  testServerTimingHeader("metric;dur=\"foo\"", {{"metric", "0", ""}});

  // unrecognized param names
  testServerTimingHeader("metric1;foo=bar;desc=description;foo=bar;dur=123.4;foo=bar,metric2", {{"metric1", "123.4", "description"}, {"metric2", "0", ""}});

  // duplicate param names
  testServerTimingHeader("metric;dur=123.4;dur=567.8", {{"metric", "123.4", ""}});
  testServerTimingHeader("metric;dur=foo;dur=567.8", {{"metric", "0", ""}});
  testServerTimingHeader("metric;desc=description1;desc=description2", {{"metric", "0", "description1"}});

  // incomplete params
  testServerTimingHeader("metric;dur;dur=123.4;desc=description", {{"metric", "0", "description"}});
  testServerTimingHeader("metric;dur=;dur=123.4;desc=description", {{"metric", "0", "description"}});
  testServerTimingHeader("metric;desc;desc=description;dur=123.4", {{"metric", "123.4", ""}});
  testServerTimingHeader("metric;desc=;desc=description;dur=123.4", {{"metric", "123.4", ""}});

  // extraneous characters after param value as token
  testServerTimingHeader("metric;desc=d1 d2;dur=123.4", {{"metric", "123.4", "d1"}});
  testServerTimingHeader("metric1;desc=d1 d2,metric2", {{"metric1", "0", "d1"}, {"metric2", "0", ""}});

  // extraneous characters after param value as quoted-string
  testServerTimingHeader("metric;desc=\"d1\" d2;dur=123.4", {{"metric", "123.4", "d1"}});
  testServerTimingHeader("metric1;desc=\"d1\" d2,metric2", {{"metric1", "0", "d1"}, {"metric2", "0", ""}});

  // nonsense - extraneous characters after entry name token
  testServerTimingHeader("metric==   \"\"foo;dur=123.4", {{"metric", "0", ""}});
  testServerTimingHeader("metric1==   \"\"foo,metric2", {{"metric1", "0", ""}});

  // nonsense - extraneous characters after param name token
  testServerTimingHeader("metric;dur foo=12", {{"metric", "0", ""}});
  testServerTimingHeader("metric;foo dur=12", {{"metric", "0", ""}});

  // nonsense - return zero entries
  testServerTimingHeader(" ", {});
  testServerTimingHeader("=", {});
  testServerTimingHeader("[", {});
  testServerTimingHeader("]", {});
  testServerTimingHeader(";", {});
  testServerTimingHeader(",", {});
  testServerTimingHeader("=;", {});
  testServerTimingHeader(";=", {});
  testServerTimingHeader("=,", {});
  testServerTimingHeader(",=", {});
  testServerTimingHeader(";,", {});
  testServerTimingHeader(",;", {});
  testServerTimingHeader("=;,", {});

  // TODO(cvazac) the following tests should actually NOT pass
  // According to the definition of token/tchar
  // (https://tools.ietf.org/html/rfc7230#appendix-B),
  // HeaderFieldTokenizer.IsTokenCharacter is being too permissive for the
  // following chars (decimal):
  // 123 '{', 125 '}', and 127 (not defined)
  //testServerTimingHeader("{", [{"name":"{"}]);
  //testServerTimingHeader("}", [{"name":"}"}]);
  //testServerTimingHeader("{}", [{"name":"{}"}]);
  //testServerTimingHeader("{\"foo\":\"bar\"},metric", [{"name":"{"}]);
