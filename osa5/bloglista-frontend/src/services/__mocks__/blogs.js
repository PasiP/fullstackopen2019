const blogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: {
      username: 'Eddy',
      name: 'Edsger W. Dijkstra',
      id: '5e275575d69ea833d8723786'
    },
    id: '5e1ce207f7ef863464eebecf'
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: {
      username: 'Eddy',
      name: 'Edsger W. Dijkstra',
      id: '5e275575d69ea833d8723786'
    },
    id: '5e1ce232f7ef863464eebed0'
  },
  {
    title: 'Angular vs React vs Vue: Which Framework to Choose in 2020',
    author: 'Shaumik Daityari',
    url: 'https://www.codeinwp.com/blog/angular-vs-vue-vs-react',
    likes: 2,
    user: {
      username: 'admin',
      name: 'admin',
      id: '5e45cbdca8514925c8aa5c8d'
    },
    id: '5e56fb8abd590f1050a2c14d'
  }
]

const getAll = () => {
  return Promise.resolve(blogs)
}

const setToken = () => {}

export default { getAll, setToken }
