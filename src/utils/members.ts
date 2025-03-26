export interface Member {
    id: number;
    name: string;
    role: string;
    image: string;
    birthday: string;
    nationality: string;
    mbti: string;
    representativeEmoji: string;
    gif?: string;
    nextBirthday?: Date
    daysUntil?: number
  }
  
  // Static data for members
export const members: { [key: string]: Member } = {
    member1: {
        id: 1,
        name: "Yoon Seo-yeon",
        role: "Vocalist",
        image: "2f3S1Da.jpg",
        birthday: "2003-08-06",
        nationality: "Korean",
        mbti: "ISFP",
        representativeEmoji: "🐶 (Puppy)",
        gif : "Y2lkPTc5MGI3NjExZGpxbm9lMGxtOXFua2I5aGp0eXcyYTh3b3dxMWt5emU5MzVocmg1ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cW9hS5al3lUuPvblI6/giphy.gif"
    },
    member2: {
        id: 2,
        name: "Jeong Hye-rin",
        role: "Main Dancer",
        image: "sOwU7z1.jpg",
        birthday: "2007-04-12",
        nationality: "Korean",
        mbti: "ESTP",
        representativeEmoji: "🐱 (Cat)",
        gif : "Y2lkPTc5MGI3NjExMTFieXBoYWhjcW12amg3MGF0NHA4Mm0xcml5dWl0am52aXV6emk3ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YnBFUYTe99juuwzXf5/giphy.gif"
    },
    member3: {
        id: 3,
        name: "Lee Ji-woo",
        role: "Main Vocalist",
        image: "ZxGkzJG.jpg",
        birthday: "2005-10-24",
        nationality: "Korean",
        mbti: "INTP",
        representativeEmoji: "🐻 (Bear)",
        gif: "Y2lkPTc5MGI3NjExeHc0NWJmOHM4eDN4dHRodDIxeWw2Nm9sY2JmMGdhanp0Z3RrNXU4ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JJ1uThVU2bidRRvQcD/giphy.gif"
    },
    member4: {
        id: 4,
        name: "Kim Chae-yeon",
        role: "Vocalist",
        image: "JVh2TIf.jpg",
        birthday: "2004-12-04",
        nationality: "Korean",
        mbti: "ESFP-A",
        representativeEmoji: "🍑 (Peach)",
        gif: "Y2lkPTc5MGI3NjExczQ3M2tsbDNnNW02eHRvYjdxNWJoM243dzMzMzhpOXF5b3l5YzhkbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7N6nxs23t4SJzTr5El/giphy.gif"
    },
    member5: {
        id: 5,
        name: "Kim Yoo-yeon",
        role: "Leader, Visual",
        image: "F16eeZf.jpg",
        birthday: "2001-02-09",
        nationality: "Korean",
        mbti: "INTP",
        representativeEmoji: "🐰 (Rabbit)",
        gif: "Y2lkPTc5MGI3NjExdDZlcG1rcXJkODJzczRrd3Flc29saWt1MGV3azFyOTFmdndob2JsYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u5nrXBvAJtbZun8VH1/giphy.gif"
    },
    member6: {
        id: 6,
        name: "Kim Soo-min",
        role: "Sub-vocalist",
        image: "S6zFUaq.jpg",
        birthday: "2007-10-03",
        nationality: "Korean",
        mbti: "ENTP",
        representativeEmoji: "🐿️ (Squirrel)",
        gif: "Y2lkPTc5MGI3NjExemRzdWpndjczODJzdnI4dHk0YXN6OTg5dDdiN2JnNDBhMXFueW9ybCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/b29RElKhFDL3yLgbjJ/giphy.gif"
    },
    member7: {
        id: 7,
        name: "Kim Na-kyoung",
        role: "Vocalist, Dancer",
        image: "mVi4uVH.jpg",
        birthday: "2002-10-13",
        nationality: "Korean",
        mbti: "INFP",
        representativeEmoji: "🐈‍⬛ (Black Cat)",
        gif: "Y2lkPTc5MGI3NjExbzVkdHgyZXI3MWI5dXg5bHhubzRrMGd6eHFwbXI1M3d4ZG5iOTBmNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vBPFGeY3vJ0g03Mwtv/giphy.gif"
    },
    member8: {
        id: 8,
        name: "Gong Yu-bin",
        role: "Main Dancer, Visual",
        image: "FVazfJd.jpg",
        birthday: "2005-02-03",
        nationality: "Korean",
        mbti: "ISTP",
        representativeEmoji: "🐯 (Tiger)",
        gif: "Y2lkPTc5MGI3NjExbTV1dzd0cWp3N2JyYzl4dTVtNGJzaGhsYXJpZTM4MXJieW85dTVtaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SlLVBSpo15gcwgAj9T/giphy.gif"
    },
    member9: {
        id: 9,
        name: "Kaede",
        role: "Main Dancer, Vocalist",
        image: "t1HeORy.jpg",
        birthday: "2005-12-20",
        nationality: "Japanese",
        mbti: "INFP",
        representativeEmoji: "🍁 (Maple Leaf)",
        gif: "Y2lkPTc5MGI3NjExYmFzY29iNW9hMHM3MnI0MGVla3ZhaDBwY2Y0bjZzYnp6NXJsdzd5MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/715P3ach0UWWau52nc/giphy.gif"
    },
    member10: {
        id: 10,
        name: "Seo Da-hyun",
        role: "Main Vocalist",
        image: "vIB6yTK.jpg",
        birthday: "2003-01-08",
        nationality: "Korean",
        mbti: "ISFP",
        representativeEmoji: "🍒 (Cherry)",
        gif: "Y2lkPTc5MGI3NjExN2E4MTY3ODZsaTBtazBsOW9pbnhlb3Zrb2w1eDE0MmdobjY0a3UzayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GxdXcwZFuEENCXuaXr/giphy.gif"
    },
    member11: {
        id: 11,
        name: "Kotone",
        role: "Main Dancer, Rapper",
        image: "dcR0vQk.jpg",
        birthday: "2004-03-10",
        nationality: "Japanese",
        mbti: "ENFP",
        representativeEmoji: "🦭 (Seal)",
        gif : "Y2lkPTc5MGI3NjExM2hkdmYwNXF0M3FhanA0MjBvNmV0a2Zja3dzN2lveXVkd2UzaHpoNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pTP2L8FaPuafKYHqnj/giphy.gif"
    },
    member12: {
        id: 12,
        name: "Kwak Yeon-ji",
        role: "Dancer, Rapper",
        image: "sTNB8Oc.jpg",
        birthday: "2008-01-08",
        nationality: "Korean",
        mbti: "ENFP",
        representativeEmoji: "🧸 (Teddy Bear)",
        gif: "Y2lkPTc5MGI3NjExbzY2MXA5cGRzOW9lN2ZnbjFyMG1iMjN4YzRuNjZtYzM0am5zNDc0bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GdB2gClNUnYddhmZzt/giphy.gif"
    },
    member13: {
        id: 13,
        name: "Nien",
        role: "Rapper, Sub-vocalist",
        image: "hYmtHFJ.jpg",
        birthday: "2003-06-02",
        nationality: "Taiwanese",
        mbti: "ESFP",
        representativeEmoji: "🍓 (Strawberry)",
        gif: "Y2lkPTc5MGI3NjExcnJ0anluajVteXZsenZqN3Z4cTV3M2lhbnV3Nmc1a3g0aXlnbjkwYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bugk046f360xED6fFV/giphy.gif"
    },
    member14: {
        id: 14,
        name: "Park So-hyun",
        role: "Dancer, Producer",
        image: "zuV96u3.jpg",
        birthday: "2002-10-13",
        nationality: "Korean",
        mbti: "INTJ",
        representativeEmoji: "🐺 (Wolf)",
        gif: "Y2lkPTc5MGI3NjExM3FxcGF0NWMxajBieXo3d3J2bmZsNWozMmR6N3ozZzd1d2g3eHI5MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2PWRUrD3qjl3mjrXP5/giphy.gif"
    },
    member15: {
        id: 15,
        name: "Xinyu",
        role: "Vocalist, Visual",
        image: "heHBK3f.jpg",
        birthday: "2002-05-25",
        nationality: "Chinese",
        mbti: "ENTP",
        representativeEmoji: "🦊 (Fox)",
        gif: "Y2lkPTc5MGI3NjExMnRwNmJ2MjU3ZWprbzZ3dXNya2phYWZ0NDB3ZDk5emx5cGxtaThzcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eAdyVvpzm8DIoi0kOr/giphy.gif"
    },
    member16: {
        id: 16,
        name: "Mayu",
        role: "Lead Vocalist",
        image: "agsA1G4.jpg",
        birthday: "2002-05-12",
        nationality: "Japanese",
        mbti: "ENFJ",
        representativeEmoji: "🐇 (Bunny)",
        gif: "Y2lkPTc5MGI3NjExOHJsN29udnBwYW81a3Rkb3NjN3ppMnJ0d3FvdWdlOTVteDMyM3FhZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/O6wkn0rNb5mRF6ojm2/giphy.gif"
    },
    member17: {
        id: 17,
        name: "Lynn",
        role: "Main Dancer",
        image: "YJImhRr.jpg",
        birthday: "2006-04-12",
        nationality: "Japanese",
        mbti: "ISFP",
        representativeEmoji: "🦈 (Shark)",
        gif: "Y2lkPTc5MGI3NjExaHZibXU4cjE3eWJkZno1eGd2NXYwZGdvdGU2ZTZoeGhzZmx3NnJ0NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RGHiWX1KfZ9NDNCk6g/giphy.gif"
    },
    member18: {
        id: 18,
        name: "JooBin",
        role: "Visual",
        image: "AIK4qGq.jpg",
        birthday: "2009-01-16",
        nationality: "Korean",
        mbti: "ISFJ",
        representativeEmoji: "🐣 (Chick)",
        gif: "Y2lkPTc5MGI3NjExOTl5NG5uYWNtb25jOTc2ZDFuODR2d285NjE2Mzg3ZmFtZXY2ZGZueiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DDeLc5YXmEX9oKfWve/giphy.gif"
    },
    member19: {
        id: 19,
        name: "Jeong Ha-yeon",
        role: "Dancer, Vocalist",
        image: "eU56zIP.jpg",
        birthday: "2007-08-01",
        nationality: "Korean",
        mbti: "ENTP",
        representativeEmoji: "🦔 (Hedgehog)",
        gif: "Y2lkPTc5MGI3NjExaWplczdsYmd3ZXFnNXBsN2JvejlkaGN0a2tnMXl3bXQydWZ1YWI2ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Slcz4VgwA6l6JAnCgN/giphy.gif"
    },
    member20: {
        id: 20,
        name: "Park Shi-on",
        role: "Main Vocalist",
        image: "JCN0ei8.jpg",
        birthday: "2006-04-03",
        nationality: "Korean",
        mbti: "ESFP",
        representativeEmoji: "🍞 (Bread)",
        gif: "Y2lkPTc5MGI3NjExZHlrN2ZwdmNqamJhajFzenN6NDhpMXBhdXkzZ2YyZTR2Yno5YW9pdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/54HEgFGgsZQQXEzpbe/giphy.gif"
    },
    member21: {
        id: 21,
        name: "Kim Chae-won",
        role: "Vocalist",
        image: "c72pbgr.jpg",
        birthday: "2007-05-02",
        nationality: "Korean",
        mbti: "INTP",
        representativeEmoji: "🎀 (Pink bow)",
        gif: "Y2lkPTc5MGI3NjExcW85NmF2ZnlvNXg4ZmczcWNoZ2MxdWVlODBhbWg2ZmU3YjVzOGcxZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/95SHx1AwHgZDjBXwlj/giphy.gif"
    }, 
    member22: {
        id: 22,
        name: "Sullin",
        role: "Sub-vocalist",
        image: "yyxL7oK.jpg",
        birthday: "2006-11-30",
        nationality: "Thai",
        mbti: "INFJ",
        representativeEmoji: "⛄ (Snowman)",
        gif: "Y2lkPTc5MGI3NjExcDMybnd6ajQ2NGwxNDluc2puYXZqeHFqNGJiMzJsdTkxdWFjbXQ3ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/O0wfrZlU0ucmOySsEG/giphy.gif"
    },
    member23: {
        id: 23,
        name: "SeoAh",
        role: "Maknae",
        image: "ksk4bgp.jpg",
        birthday: "2010-06-11",
        nationality: "Korean",
        mbti: "ESTP",
        representativeEmoji: "☀️ (Sun)",
        gif: "Y2lkPTc5MGI3NjExaXl3amNrdG5vNW82ZnE0bHk3eHh4dHY1bHNndXp0Z3A3a3FwNWk1YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZL3wHXwMP9Qtf2kqaU/giphy.gif"
    },
    member24: {
        id: 24,
        name: "JiYeon",
        role: "Dancer, Vocalist",
        image: "hdAz2xc.jpg",
        birthday: "2004-02-13",
        nationality: "Korean",
        mbti: "ISTP",
        representativeEmoji: "🦢 (Swan)",
        gif: "Y2lkPTc5MGI3NjExenZxYmR6YWdkd2N0eDl3bmtibGVzcDgzMjd3b3BkNWEzdHRucDZxbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ajWOekSY3KshU3JVBS/giphy.gif"
    } 
};
  