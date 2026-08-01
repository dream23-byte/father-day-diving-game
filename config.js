const gameConfig = {
  siteTitle: "父親節潛水闖關",
  version: 2,
  colors: {
    primary: "#40E0D0",
    secondary: "#87CEEB",
    accent: "#F5DEB3",
    background: "#E0F7FA",
    text: "#006064"
  },
  equipment: [
    {
      id: "mask",
      name: "蛙鏡",
      icon: "photos/mask.png",
      location: { x: 15, y: 30 },
      question: "這是你第一次帶爸爸去海邊的照片，爸爸當時說了什麼？",
      photos: [
        "photos/memory1-1.jpg",
        "photos/memory1-2.jpg",
        "photos/memory1-3.jpg"
      ]
    },
    {
      id: "snorkel",
      name: "呼吸管",
      icon: "photos/snorkel.png",
      location: { x: 75, y: 20 },
      question: "這是爸爸教你游泳的照片，你還記得嗎？",
      photos: [
        "photos/memory2-1.jpg",
        "photos/memory2-2.jpg",
        "photos/memory2-3.jpg"
      ]
    },
    {
      id: "fins",
      name: "蛙鞋",
      icon: "photos/fins.png",
      location: { x: 50, y: 60 },
      question: "這是全家福海邊出遊，那天最開心的事是什麼？",
      photos: [
        "photos/memory3-1.jpg",
        "photos/memory3-2.jpg",
        "photos/memory3-3.jpg"
      ]
    },
    {
      id: "wetsuit",
      name: "潛水衣",
      icon: "photos/wetsuit.png",
      location: { x: 20, y: 70 },
      question: "爸爸第一次教你騎腳踏車是在海邊，你還記得嗎？",
      photos: [
        "photos/memory4-1.jpg",
        "photos/memory4-2.jpg",
        "photos/memory4-3.jpg"
      ]
    },
    {
      id: "tank",
      name: "氣瓶",
      icon: "photos/tank.png",
      location: { x: 80, y: 65 },
      question: "這是爸爸生日，你們一起在海邊慶祝的照片",
      photos: [
        "photos/memory5-1.jpg",
        "photos/memory5-2.jpg",
        "photos/memory5-3.jpg"
      ]
    },
    {
      id: "goggles",
      name: "面鏡",
      icon: "photos/goggles.png",
      location: { x: 45, y: 40 },
      question: "最近一次和爸爸去海邊是什麼時候？那天做了什麼？",
      photos: [
        "photos/memory6-1.jpg",
        "photos/memory6-2.jpg",
        "photos/memory6-3.jpg"
      ]
    }
  ],
  postcard: {
    message: "親愛的爸爸，謝謝您一直以來的陪伴與保護。祝您父親節快樂！",
    address: "全世界最棒的爸爸收",
    stamp: "2026.08.08"
  }
};
