// empty string
testServerTimingHeader("", []);

// name only
testServerTimingHeader("metric", [{"name":"metric"}]);

// name and duration
testServerTimingHeader("metric;dur=123.4", [{"name":"metric","dur":123.4}]);
testServerTimingHeader("metric;dur=\"123.4\"", [{"name":"metric","dur":123.4}]);

// name and description
testServerTimingHeader("metric;desc=description", [{"name":"metric","desc":"description"}]);
testServerTimingHeader("metric;desc=\"description\"", [{"name":"metric","desc":"description"}]);

// name, duration, and description
testServerTimingHeader("metric;dur=123.4;desc=description", [{"name":"metric","dur":123.4,"desc":"description"}]);
testServerTimingHeader("metric;desc=description;dur=123.4", [{"name":"metric","desc":"description","dur":123.4}]);

// special chars in name
testServerTimingHeader("aB3!#$%&'*+-.^_`|~", [{"name":"aB3!#$%&'*+-.^_`|~"}])

// delimiter chars in quoted description
testServerTimingHeader("metric;desc=\"descr;,=iption\";dur=123.4", [{"name":"metric","desc":"descr;,=iption","dur":123.4}])

// spaces
testServerTimingHeader("metric ; ", [{"name":"metric"}]);
testServerTimingHeader("metric , ", [{"name":"metric"}]);
testServerTimingHeader("metric ; dur = 123.4 ; desc = description", [{"name":"metric","dur":123.4,"desc":"description"}]);
testServerTimingHeader("metric ; desc = description ; dur = 123.4", [{"name":"metric","desc":"description","dur":123.4}]);
testServerTimingHeader("metric;desc = \"description\"", [{"name":"metric","desc":"description"}]);

// tabs (known failures in chrome)
//testServerTimingHeader("metric\t;\t", [{"name":"metric"}]);
//testServerTimingHeader("metric\t,\t", [{"name":"metric"}]);
//testServerTimingHeader("metric\t;\tdur\t=\t123.4\t;\tdesc\t=\tdescription", [{"name":"metric","dur":123.4,"desc":"description"}]);
//testServerTimingHeader("metric\t;\tdesc\t=\tdescription\t;\tdur\t=\t123.4", [{"name":"metric","desc":"description","dur":123.4}]);
//testServerTimingHeader("metric;desc\t=\t\"description\"", [{"name":"metric","desc":"description"}]);

// multiple entries
testServerTimingHeader("metric1;dur=12.3;desc=description1,metric2;dur=45.6;desc=description2,metric3;dur=78.9;desc=description3", [{"name":"metric1","dur":12.3,"desc":"description1"}, {"name":"metric2","dur":45.6,"desc":"description2"}, {"name":"metric3","dur":78.9,"desc":"description3"}]);
testServerTimingHeader("metric1,metric2 ,metric3, metric4 , metric5", [{"name":"metric1"}, {"name":"metric2"}, {"name":"metric3"}, {"name":"metric4"}, {"name":"metric5"}]);

// quoted-strings - happy path
testServerTimingHeader("metric;desc=\"description\"", [{"name":"metric","desc":"description"}]);
testServerTimingHeader("metric;desc=\"\t description \t\"", [{"name":"metric","desc":"\t description \t"}]);
testServerTimingHeader("metric;desc=\"descr\\\"iption\"", [{"name":"metric","desc":"descr\"iption"}]);

// quoted-strings - others
// metric;desc=\ --> ''
testServerTimingHeader("metric;desc=\\", [{"name":"metric","desc":""}]);
// metric;desc=" --> ''
testServerTimingHeader("metric;desc=\"", [{"name":"metric","desc":""}]);
// metric;desc=\\ --> ''
testServerTimingHeader("metric;desc=\\\\", [{"name":"metric","desc":""}]);
// metric;desc=\" --> ''
testServerTimingHeader("metric;desc=\\\"", [{"name":"metric","desc":""}]);
// metric;desc="\ --> ''
testServerTimingHeader("metric;desc=\"\\", [{"name":"metric","desc":""}]);
// metric;desc="" --> ''
testServerTimingHeader("metric;desc=\"\"", [{"name":"metric","desc":""}]);
// metric;desc=\\\ --> ''
testServerTimingHeader("metric;desc=\\\\\\", [{"name":"metric","desc":""}]);
// metric;desc=\\" --> ''
testServerTimingHeader("metric;desc=\\\\\"", [{"name":"metric","desc":""}]);
// metric;desc=\"\ --> ''
testServerTimingHeader("metric;desc=\\\"\\", [{"name":"metric","desc":""}]);
// metric;desc=\"" --> ''
testServerTimingHeader("metric;desc=\\\"\"", [{"name":"metric","desc":""}]);
// metric;desc="\\ --> ''
testServerTimingHeader("metric;desc=\"\\\\", [{"name":"metric","desc":""}]);
// metric;desc="\" --> ''
testServerTimingHeader("metric;desc=\"\\\"", [{"name":"metric","desc":""}]);
// metric;desc=""\ --> ''
testServerTimingHeader("metric;desc=\"\"\\", [{"name":"metric","desc":""}]);
// metric;desc=""" --> ''
testServerTimingHeader("metric;desc=\"\"\"", [{"name":"metric","desc":""}]);
// metric;desc=\\\\ --> ''
testServerTimingHeader("metric;desc=\\\\\\\\", [{"name":"metric","desc":""}]);
// metric;desc=\\\" --> ''
testServerTimingHeader("metric;desc=\\\\\\\"", [{"name":"metric","desc":""}]);
// metric;desc=\\"\ --> ''
testServerTimingHeader("metric;desc=\\\\\"\\", [{"name":"metric","desc":""}]);
// metric;desc=\\"" --> ''
testServerTimingHeader("metric;desc=\\\\\"\"", [{"name":"metric","desc":""}]);
// metric;desc=\"\\ --> ''
testServerTimingHeader("metric;desc=\\\"\\\\", [{"name":"metric","desc":""}]);
// metric;desc=\"\" --> ''
testServerTimingHeader("metric;desc=\\\"\\\"", [{"name":"metric","desc":""}]);
// metric;desc=\""\ --> ''
testServerTimingHeader("metric;desc=\\\"\"\\", [{"name":"metric","desc":""}]);
// metric;desc=\""" --> ''
testServerTimingHeader("metric;desc=\\\"\"\"", [{"name":"metric","desc":""}]);
// metric;desc="\\\ --> ''
testServerTimingHeader("metric;desc=\"\\\\\\", [{"name":"metric","desc":""}]);
// metric;desc="\\" --> '\'
testServerTimingHeader("metric;desc=\"\\\\\"", [{"name":"metric","desc":"\\"}]);
// metric;desc="\"\ --> ''
testServerTimingHeader("metric;desc=\"\\\"\\", [{"name":"metric","desc":""}]);
// metric;desc="\"" --> '"'
testServerTimingHeader("metric;desc=\"\\\"\"", [{"name":"metric","desc":"\""}]);
// metric;desc=""\\ --> ''
testServerTimingHeader("metric;desc=\"\"\\\\", [{"name":"metric","desc":""}]);
// metric;desc=""\" --> ''
testServerTimingHeader("metric;desc=\"\"\\\"", [{"name":"metric","desc":""}]);
// metric;desc="""\ --> ''
testServerTimingHeader("metric;desc=\"\"\"\\", [{"name":"metric","desc":""}]);
// metric;desc="""" --> ''
testServerTimingHeader("metric;desc=\"\"\"\"", [{"name":"metric","desc":""}]);

// duplicate entry names
testServerTimingHeader("metric;dur=12.3;desc=description1,metric;dur=45.6;desc=description2", [{"name":"metric","dur":12.3,"desc":"description1"}, {"name":"metric","dur":45.6,"desc":"description2"}]);

// param name case sensitivity
testServerTimingHeader("metric;DuR=123.4;DeSc=description", [{"name":"metric","dur":123.4,"desc":"description"}]);

// param value case sensitivity
testServerTimingHeader("MeTrIc;desc=DeScRiPtIoN", [{"name":"MeTrIc","desc":"DeScRiPtIoN"}]);

// non-numeric durations
testServerTimingHeader("metric;dur=foo", [{"name":"metric","dur":0}]);
testServerTimingHeader("metric;dur=\"foo\"", [{"name":"metric","dur":0}]);

// unrecognized param names
testServerTimingHeader("metric1;foo=bar;desc=description;foo=bar;dur=123.4;foo=bar,metric2", [{"name":"metric1","desc":"description","dur":123.4}, {"name":"metric2"}]);

// duplicate param names
testServerTimingHeader("metric;dur=123.4;dur=567.8", [{"name":"metric","dur":123.4}]);
testServerTimingHeader("metric;dur=foo;dur=567.8", [{"name":"metric","dur":0}]);
testServerTimingHeader("metric;desc=description1;desc=description2", [{"name":"metric","desc":"description1"}]);

// incomplete params
testServerTimingHeader("metric;dur;dur=123.4;desc=description", [{"name":"metric","dur":0,"desc":"description"}]);
testServerTimingHeader("metric;dur=;dur=123.4;desc=description", [{"name":"metric","dur":0,"desc":"description"}]);
testServerTimingHeader("metric;desc;desc=description;dur=123.4", [{"name":"metric","desc":"","dur":123.4}]);
testServerTimingHeader("metric;desc=;desc=description;dur=123.4", [{"name":"metric","desc":"","dur":123.4}]);

// extraneous characters after param value as token
testServerTimingHeader("metric;desc=d1 d2;dur=123.4", [{"name":"metric","desc":"d1","dur":123.4}]);
testServerTimingHeader("metric1;desc=d1 d2,metric2", [{"name":"metric1","desc":"d1"},{"name":"metric2"}]);

// extraneous characters after param value as quoted-string
testServerTimingHeader("metric;desc=\"d1\" d2;dur=123.4", [{"name":"metric","desc":"d1","dur":123.4}]);
testServerTimingHeader("metric1;desc=\"d1\" d2,metric2", [{"name":"metric1","desc":"d1"},{"name":"metric2"}]);

// nonsense - extraneous characters after entry name token
testServerTimingHeader("metric==   \"\"foo;dur=123.4", [{"name":"metric"}]);
testServerTimingHeader("metric1==   \"\"foo,metric2", [{"name":"metric1"}]);

// nonsense - extraneous characters after param name token
testServerTimingHeader("metric;dur foo=12", [{"name":"metric","dur":0}]);
testServerTimingHeader("metric;foo dur=12", [{"name":"metric"}]);

// nonsense - return zero entries
testServerTimingHeader(" ", []);
testServerTimingHeader("=", []);
testServerTimingHeader("[", []);
testServerTimingHeader("]", []);
testServerTimingHeader(";", []);
testServerTimingHeader(",", []);
testServerTimingHeader("=;", []);
testServerTimingHeader(";=", []);
testServerTimingHeader("=,", []);
testServerTimingHeader(",=", []);
testServerTimingHeader(";,", []);
testServerTimingHeader(",;", []);
testServerTimingHeader("=;,", []);

// tabs
testServerTimingHeader("metric;	desc=	tabs-should-get-trimmed	;dur=	42	", [{"name":"metric","desc":"tabs-should-get-trimmed","dur": 42.0}]);

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
