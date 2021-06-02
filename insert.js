const knex = require("./db");
const Cite = require("citation-js");

let cite_1 = `{
    "issued": {
        "month": "04",
        "year": "2018",
        "day": "25"
    },
    "id": "SET",
    "director": [{
        "given": "Joe",
        "family": "Russo"
    }, {
        "given": "Anthony",
        "family": "Russo"
    }],
    "title": "Avengers: Infinity War",
    "publisher": "Walt Disney Pictures",
    "publisher-place": "United States of America",
    "source": null,
    "abstract": "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos. A despot of intergalactic infamy, his goal is to collect all six Infinity Stones, artifacts of unimaginable power, and use them to inflict his twisted will on all of reality. Everything the Avengers have fought for has led up to this moment - the fate of Earth and existence itself has never been more uncertain.",
    "type": "motion_picture"
}`;

let cite_2 = `{
  "id": "http://example.org/id/1234",
  "type": "book",
  "title": "Das Schloss",
  "publisher": "Wolff",
  "publisher-place": "München",
  "language": "de",
  "author": [
    { "family": "Kafka", "given": "Franz" }
  ],
  "issued": { "date-parts": [ [ "1926" ] ] }
}`;

let cite_3 = ` {
    "DOI": "10.1371/journal.pone.0010676",
    "URL": "http://dx.doi.org/10.1371/journal.pone.0010676",
    "author": [
      {
        "family": "Williams",
        "given": "Jeffrey T."
      },
      {
        "family": "Carpenter",
        "given": "Kent E."
      },
      {
        "family": "Tassell",
        "given": "James L. Van"
      },
      {
        "family": "Hoetjes",
        "given": "Paul"
      },
      {
        "family": "Toller",
        "given": "Wes"
      },
      {
        "family": "Etnoyer",
        "given": "Peter"
      },
      {
        "family": "Smith",
        "given": "Michael"
      }
    ],
    "container-title": "PLoS ONE",
    "editor": [
      {
        "family": "Gratwicke",
        "given": "Brian"
      }
    ],
    "id": "Williams_2010",
    "issue": "5",
    "issued": {
      "date-parts": [
        [
          2010,
          5
        ]
      ]
    },
    "page": "e10676",
    "publisher": "Public Library of Science (PLoS)",
    "title": "Biodiversity Assessment of the Fishes of Saba Bank Atoll, Netherlands Antilles",
    "type": "article-journal",
    "volume": "5"
  }`;

let cite_4 = `{
    "id": "Q23571040",
    "type": "article-journal",
    "title": "Correlation of the Base Strengths of Amines 1",
    "DOI": "10.1021/ja01577a030",
    "author": [
      {
    	"given": "H. K.",
    	"family": "Hall"
      }
    ],
    "issued": [
      {
	       "date-parts": [ "1957", "1", "1" ]
      }
    ],
    "container-title": "Journal of the American Chemical Society",
    "volume": "79",
    "issue": "20",
    "page": "5441-5444"
  }`;

let cite_5 = `{
      "id": "ITEM-1",
      "title": "Boundaries of Dissent: Protest and State Power in the Media Age",
      "author": [
        {
          "family": "D'Arcus",
          "given": "Bruce",
          "static-ordering": false
        }
      ],
      "note": "The apostrophe in Bruce's name appears in proper typeset form.",
      "publisher": "Routledge",
      "publisher-place": "New York",
      "issued": {
        "date-parts": [
          [
            2006
          ]
        ]
      },
      "type": "book"
    }`;

let cite_6 = `{
      "id": "ITEM-3",
      "title": "Key Process Conditions for Production of C<sub>4</sub> Dicarboxylic Acids in Bioreactor Batch Cultures of an Engineered <i>Saccharomyces cerevisiae</i> Strain",
      "note": "This cite illustrates the rich text formatting capabilities in the new processor, as well as page range collapsing (in this case, applying the collapsing method required by the Chicago Manual of Style).  Also, as the IEEE example above partially illustrates, we also offer robust handling of particles such as \\"van\\" and \\"de\\" in author names.",
      "author": [
        {
          "family": "Zelle",
          "given": "Rintze M."
        },
        {
          "family": "Hulster",
          "given": "Erik",
          "non-dropping-particle": "de"
        },
        {
          "family": "Kloezen",
          "given": "Wendy"
        },
        {
          "family": "Pronk",
          "given": "Jack T."
        },
        {
          "family": "Maris",
          "given": "Antonius J.A.",
          "non-dropping-particle": "van"
        }
      ],
      "container-title": "Applied and Environmental Microbiology",
      "issued": {
        "date-parts": [
          [
            2010,
            2
          ]
        ]
      },
      "page": "744-750",
      "volume": "76",
      "issue": "3",
      "DOI": "10.1128/AEM.02396-09",
      "type": "article-journal"
    }`;

let cite_7 = `{
      "id": "ITEM-2",
      "author": [
        {
          "family": "Bennett",
          "given": "Frank G.",
          "suffix": "Jr.",
          "comma-suffix": true,
          "static-ordering": false
        }
      ],
      "title": "Getting Property Right: \\"Informal\\" Mortgages in the Japanese Courts",
      "container-title": "Pacific Rim Law & Policy Journal",
      "volume": "18",
      "page": "463-509",
      "issued": {
        "date-parts": [
          [
            2009,
            8
          ]
        ]
      },
      "type": "article-journal",
      "note": "Note the flip-flop behavior of the quotations marks around \\"informal\\" in the title of this citation.  This works for quotation marks in any style locale.  Oh, and, uh, these notes illustrate the formatting of annotated bibliographies (!)."
    }`;

let cite_8 = `{
      "id": "ITEM-4",
      "author": [
        {
          "family": "Razlogova",
          "given": "Elena"
        }
      ],
      "title": "Radio and Astonishment: The Emergence of Radio Sound, 1920-1926",
      "type": "speech",
      "event": "Society for Cinema Studies Annual Meeting",
      "event-place": "Denver, CO",
      "note": "All styles in the CSL repository are supported by the new processor, including the popular Chicago styles by Elena.",
      "issued": {
        "date-parts": [
          [
            2002,
            5
          ]
        ]
      }
    }`;

let cite_9 = `{
      "id": "ITEM-5",
      "author": [
        {
          "family": "\\u68b6\\u7530",
          "given": "\\u5c06\\u53f8",
          "multi": {
            "_key": {
              "ja-alalc97": {
                "family": "Kajita",
                "given": "Shoji"
              }
            }
          }
        },
        {
          "family": "\\u89d2\\u6240",
          "given": "\\u8003",
          "multi": {
            "_key": {
              "ja-alalc97": {
                "family": "Kakusho",
                "given": "Takashi"
              }
            }
          }
        },
        {
          "family": "\\u4e2d\\u6fa4",
          "given": "\\u7be4\\u5fd7",
          "multi": {
            "_key": {
              "ja-alalc97": {
                "family": "Nakazawa",
                "given": "Atsushi"
              }
            }
          }
        },
        {
          "family": "\\u7af9\\u6751",
          "given": "\\u6cbb\\u96c4",
          "multi": {
            "_key": {
              "ja-alalc97": {
                "family": "Takemura",
                "given": "Haruo"
              }
            }
          }
        },
        {
          "family": "\\u7f8e\\u6fc3",
          "given": "\\u5c0e\\u5f66",
          "multi": {
            "_key": {
              "ja-alalc97": {
                "family": "Mino",
                "given": "Michihiko"
              }
            }
          }
        },
        {
          "family": "\\u9593\\u702c",
          "given": "\\u5065\\u4e8c",
          "multi": {
            "_key": {
              "ja-alalc97": {
                "family": "Mase",
                "given": "Kenji"
              }
            }
          }
        }
      ],
      "title": "\\u9ad8\\u7b49\\u6559\\u80b2\\u6a5f\\u95a2\\u306b\\u304a\\u3051\\u308b\\u6b21\\u4e16\\u4ee3\\u6559\\u80b2\\u5b66\\u7fd2\\u652f\\u63f4\\u30d7\\u30e9\\u30c3\\u30c8\\u30d5\\u30a9\\u30fc\\u30e0\\u306e\\u69cb\\u7bc9\\u306b\\u5411\\u3051\\u3066",
      "multi": {
        "_keys": {
          "title": {
            "ja-alalc97": "K\\u014dt\\u014d ky\\u014diku ni okeru jisedai ky\\u014diku gakush\\u016b shien puratto f\\u014dmu no k\\u014dchiku ni mukete",
            "en": "Toward the Development of Next-Generation Platforms for Teaching and Learning in Higher Education"
          },
          "container-title": {
            "ja-alalc97": "Nihon ky\\u014diku k\\u014dgaku ronbunshi",
            "en": "Journal of the Japan Educational Engineering Society"
          }
        }
      },
      "container-title": "\\u65e5\\u672c\\u6559\\u80b2\\u5de5\\u5b66\\u4f1a\\u8ad6\\u6587\\u8a8c",
      "volume": "31",
      "issue": "3",
      "page": "297-305",
      "issued": {
        "date-parts": [
          [
            2007,
            12
          ]
        ]
      },
      "note": "Note the transformations to which this cite is subjected in the samples above, and the fact that it appears in the correct sort position in all rendered forms.  Selection of multi-lingual content can be configured in the style, permitting one database to serve a multi-lingual author in all languages in which she might publish.",
      "type": "article-journal"
    }`;
let cite_10 = `{
      "id": "ITEM-6",
      "title": "Evaluating Components of International Migration: Consistency of 2000 Nativity Data",
      "note": "This cite illustrates the formatting of institutional authors.  Note that there is no \\"and\\" between the individual author and the institution with which he is affiliated.",
      "author": [
        {
          "family": "Malone",
          "given": "Nolan J.",
          "static-ordering": false
        },
        {
          "literal": "U.S. Bureau of the Census"
        }
      ],
      "publisher": "Routledge",
      "publisher-place": "New York",
      "issued": {
        "date-parts": [
          [
            2001,
            12,
            5
          ]
        ]
      },
      "type": "book"
    }`;
let cite_11 = `{
      "id": "ITEM-7",
      "title": "True Crime Radio and Listener Disenchantment with Network Broadcasting, 1935-1946",
      "author": [
        {
          "family": "Razlogova",
          "given": "Elena"
        }
      ],
      "container-title": "American Quarterly",
      "volume": "58",
      "page": "137-158",
      "issued": {
        "date-parts": [
          [
            2006,
            3
          ]
        ]
      },
      "type": "article-journal"
    }`;
let cite_12 = `{
      "id": "ITEM-8",
      "title": "The Guantanamobile Project",
      "container-title": "Vectors",
      "volume": "1",
      "author": [
        {
          "family": "Razlogova",
          "given": "Elena"
        },
        {
          "family": "Lynch",
          "given": "Lisa"
        }
      ],
      "issued": {
        "season": 3,
        "date-parts": [
          [
            2005
          ]
        ]
      },
      "type": "article-journal"
    }`;
let cite_13 = `{
      "id": "ITEM-9",
      "container-title": "FEMS Yeast Research",
      "volume": "9",
      "issue": "8",
      "page": "1123-1136",
      "title": "Metabolic engineering of <i>Saccharomyces cerevisiae</i> for production of carboxylic acids: current status and challenges",
      "contributor": [
        {
          "family": "Zelle",
          "given": "Rintze M."
        }
      ],

      "author": [
        {
          "family": "Abbott",
          "given": "Derek A."
        },
        {
          "family": "Zelle",
          "given": "Rintze M."
        },
        {
          "family": "Pronk",
          "given": "Jack T."
        },
        {
          "family": "Maris",
          "given": "Antonius J.A.",
          "non-dropping-particle": "van"
        }
      ],

      "issued": {
        "season": "2",
        "date-parts": [
          [
            2009,
            6,
            6
          ]
        ]
      },
      "type": "article-journal"
    }`;
let cite_14 = `{
      "container-title": "N.Y.2d",
      "id": "ITEM-10",
      "issued": {
        "date-parts": [
          [
            "1989"
          ]
        ]
      },
      "page": "683",
      "title": "People v. Taylor",
      "type": "legal_case",
      "volume": 73
    }`;
let cite_15 = `{
      "container-title": "N.E.2d",
      "id": "ITEM-11",
      "issued": {
        "date-parts": [
          [
            "1989"
          ]
        ]
      },
      "page": "386",
      "title": "People v. Taylor",
      "type": "legal_case",
      "volume": 541
    }`;
let cite_16 = `{
      "container-title": "N.Y.S.2d",
      "id": "ITEM-12",
      "issued": {
        "date-parts": [
          [
            "1989"
          ]
        ]
      },
      "page": "357",
      "title": "People v. People",
      "type": "legal_case",
      "volume": 543
    }`;
/**/

knex("reference")
  .insert([
    {
      guid: "8539d0c3-062a-45b5-b7d8-2840146b0698",
      subtype: "Blog",
      notes: "a Quite interesting blog",
      json: cite_1,
    },
    {
      guid: "eb00e2a0-bf46-4029-b2a6-5cdda85bc49c",
      subtype: "Journal",
      notes: "This is very cool too!",
      json: cite_2,
    },
    {
      guid: "fac2217f-23c9-4810-a9b1-760aefade82c",
      subtype: "Book",
      notes: "Very boring, but very bb",
      json: cite_3,
    },
    {
      guid: "7b26ce94-ad8b-482b-8088-239af5c7902a",
      subtype: "Paper",
      notes: "This could work too... maybe",
      json: cite_4,
    },
    {
      guid: "bb4f1d81-f88e-4e54-9203-5497ca860a8e",
      subtype: "Paper",
      notes: "Bad!",
      json: cite_5,
    },
    {
      guid: "f3a819ef-d41d-47b5-99e8-473f0248da9c",
      subtype: "Paper",
      notes: "contains the world formula",
      json: cite_6,
    },
    {
      guid: "1",
      subtype: "Paper",
      notes: "contains the world formula",
      json: cite_7,
    },

    {
      guid: "2",
      subtype: "Paper",
      notes: "contains the world formula",
      json: cite_8,
    },

    {
      guid: "3",
      subtype: "Paper",
      notes: "contains the world formula",
      json: cite_9,
    },

    {
      guid: "4",
      subtype: "Paper",
      notes: "contains the world formula",
      json: cite_10,
    },

    {
      guid: "5",
      subtype: "Paper",
      notes: "contains the world formula",
      json: cite_11,
    },

    {
      guid: "6",
      subtype: "Paper",
      notes: "contains the world formula",
      json: cite_12,
    },

    {
      guid: "7",
      subtype: "Paper",
      notes: "contains the world formula",
      json: cite_13,
    },

    {
      guid: "8",
      subtype: "Paper",
      notes: "contains the world formula",
      json: cite_14,
    },

    {
      guid: "9",
      subtype: "Paper",
      notes: "contains the world formula",
      json: cite_15,
    },

    {
      guid: "10",
      subtype: "Paper",
      notes: "contains the world formula",
      json: cite_16,
    },
  ])
  .then(() => {
    // Send a success message in response
    console.log("reference insert: done!!");
  })
  .catch((err) => {
    // Send a error message in response
    console.log("error: insert(reference)");
  });

knex("ref_group")
  .insert([
    {
      guid: "1",
      name: "1. ABCD",
      type: "folder",
    },
    {
      guid: "11",
      name: "1.1. ABCD",
      type: "folder",
      parent: "1",
    },
    {
      guid: "12",
      name: "1.2. ABCD",
      type: "list",
      parent: "1",
    },
    {
      guid: "13",
      name: "1.3. ABCD",
      type: "list",
      parent: "1",
    },
    {
      guid: "2",
      name: "2. ABCD",
      type: "folder",
    },
    {
      guid: "3",
      name: "3. ABCD",
      type: "list",
    },
  ])
  .then(() => {
    // Send a success message in response
    console.log("ref_group insert: done!");
  })
  .catch((err) => {
    // Send a error message in response
    console.log("error: insert(reference)", err);
  });

knex("referencePartOfGroup")
  .insert([
    {
      reference_id: "7b26ce94-ad8b-482b-8088-239af5c7902a",
      group_id: "13",
    },
    {
      reference_id: "7b26ce94-ad8b-482b-8088-239af5c7902a",
      group_id: "12",
    },
    {
      reference_id: "8539d0c3-062a-45b5-b7d8-2840146b0698",
      group_id: "3",
    },
    {
      reference_id: "8539d0c3-062a-45b5-b7d8-2840146b0698",
      group_id: "12",
    },
  ])
  .then(() => {
    // Send a success message in response
    console.log("referencePartOfGroup insert: done!");
  })
  .catch((err) => {
    // Send a error message in response
    console.log("error: insert(referencePartOfGroup)", err);
  });

// Remove:
knex("author")
  .insert([
    {
      guid: "5435545",
      firstname: "Gareth",
      lastname: "Bilaney",
      role: "Translator",
    },
    {
      guid: "65435545",
      firstname: "Wolfski-Alex",
      lastname: "Kirtschovski",
      role: "Singer",
    },
  ])
  .then(() => {
    // Send a success message in response
    console.log("success!");
  })
  .catch((err) => {
    // Send a error message in response
    console.log("error: insert(reference)");
  });
