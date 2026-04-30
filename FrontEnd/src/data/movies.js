// filepath: src/data/movies.js
export const MOVIES = [
  { id: '1', title: 'Stellar Void', genre: ['Sci-Fi', 'Action'], rating: 'PG-13', duration: '2h 22m', description: 'In the distant reaches of the galaxy, a lone astronaut discovers a signal that could either save humanity or herald its destruction. Racing against time and alien forces, she must unravel the mystery before the void consumes everything.', cast: ['Zoe Saldana', 'Chris Pratt', 'Idris Elba'], director: 'James Cameron', image: 'https://images.unsplash.com/photo-1576157873436-2635b5f6c1d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', status: 'now-showing', releaseDate: 'Feb 14, 2026', score: 8.4 },
  { id: '2', title: 'Shadow Protocol', genre: ['Thriller', 'Mystery'], rating: 'R', duration: '2h 05m', description: 'A seasoned detective uncovers a web of corruption that reaches the highest levels of government. As the truth becomes clearer, the danger grows — and someone powerful wants her silenced permanently.', cast: ['Viola Davis', 'Jake Gyllenhaal', 'Oscar Isaac'], director: 'Denis Villeneuve', image: 'https://images.unsplash.com/photo-1762115445557-967c1504ffe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', status: 'now-showing', releaseDate: 'Jan 30, 2026', score: 7.9 },
  { id: '3', title: 'Iron Tempest', genre: ['Action', 'Superhero'], rating: 'PG-13', duration: '2h 38m', description: 'When a devastating storm awakens ancient power deep within the Earth, only one hero stands between civilization and total annihilation. But the greatest threat may come from within.', cast: ['Dwayne Johnson', 'Margot Robbie', 'Henry Cavill'], director: 'Zack Snyder', image: 'https://images.unsplash.com/photo-1600711847896-ea25db3164e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', status: 'now-showing', releaseDate: 'Feb 01, 2026', score: 7.5 },
  { id: '4', title: 'Last Sunrise', genre: ['Romance', 'Drama'], rating: 'PG', duration: '1h 58m', description: "Two strangers meet on opposite ends of a world-altering crisis and find unexpected love. As time runs out for everything they've known, they must decide what truly matters.", cast: ['Florence Pugh', 'Timothee Chalamet', 'Cate Blanchett'], director: 'Greta Gerwig', image: 'https://images.unsplash.com/photo-1735612919187-d03df88f153f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', status: 'now-showing', releaseDate: 'Jan 17, 2026', score: 8.1 },
  { id: '5', title: 'The Hollow', genre: ['Horror', 'Supernatural'], rating: 'R', duration: '1h 52m', description: "A family moves into an isolated farmhouse only to discover that its walls breathe with the whispers of the dead. What lurks inside is far older than any ghost — and it's hungry.", cast: ['Lupita Nyongo', 'Bill Skarsgard', 'Toni Collette'], director: 'Jordan Peele', image: 'https://images.unsplash.com/photo-1760577315790-3a0ed3f42496?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', status: 'now-showing', releaseDate: 'Feb 07, 2026', score: 7.7 },
  { id: '6', title: 'Realm of Ashes', genre: ['Fantasy', 'Adventure'], rating: 'PG-13', duration: '2h 50m', description: 'A forgotten prophecy, a crumbling kingdom, and a reluctant hero — Realm of Ashes weaves an epic tale of magic, betrayal, and redemption across a world on the brink of war.', cast: ['Anya Taylor-Joy', 'Tom Hiddleston', 'Pedro Pascal'], director: 'Peter Jackson', image: 'https://images.unsplash.com/photo-1767709879762-c7a6ce819aeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', status: 'coming-soon', releaseDate: 'Apr 03, 2026', score: 9.0 },
  { id: '7', title: 'Pixel Dreams', genre: ['Animation', 'Family'], rating: 'G', duration: '1h 44m', description: 'A curious young girl discovers she can step inside any painting she touches. As she journeys through breathtaking worlds of art, she learns that imagination is the most powerful force in the universe.', cast: ['Ava DuVernay', 'Ariana DeBose', 'Jack Black'], director: 'Hayao Miyazaki', image: 'https://images.unsplash.com/photo-1561268634-bc32e4604a38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', status: 'coming-soon', releaseDate: 'May 22, 2026', score: 8.8 }
];

export const SHOWTIMES = [
  { id: 's1', movieId: '1', date: '2026-03-03', time: '10:00 AM', hall: 'Hall A', format: 'IMAX', availableSeats: 42 },
  { id: 's2', movieId: '1', date: '2026-03-03', time: '01:30 PM', hall: 'Hall B', format: '2D', availableSeats: 78 },
  { id: 's3', movieId: '1', date: '2026-03-03', time: '04:45 PM', hall: 'Hall C', format: '3D', availableSeats: 30 },
  { id: 's4', movieId: '1', date: '2026-03-03', time: '08:15 PM', hall: 'Hall A', format: 'IMAX', availableSeats: 15 },
  { id: 's5', movieId: '1', date: '2026-03-04', time: '11:00 AM', hall: 'Hall B', format: '2D', availableSeats: 90 },
  { id: 's6', movieId: '1', date: '2026-03-04', time: '03:00 PM', hall: 'Hall C', format: '3D', availableSeats: 55 },
  { id: 's7', movieId: '1', date: '2026-03-04', time: '07:30 PM', hall: 'Hall A', format: 'IMAX', availableSeats: 28 },
  { id: 's8', movieId: '1', date: '2026-03-05', time: '10:30 AM', hall: 'Hall B', format: '2D', availableSeats: 66 },
  { id: 's9', movieId: '2', date: '2026-03-03', time: '11:00 AM', hall: 'Hall D', format: '2D', availableSeats: 60 },
  { id: 's10', movieId: '2', date: '2026-03-03', time: '02:30 PM', hall: 'Hall D', format: '2D', availableSeats: 45 },
  { id: 's11', movieId: '2', date: '2026-03-03', time: '06:00 PM', hall: 'Hall E', format: 'Dolby', availableSeats: 20 },
  { id: 's12', movieId: '2', date: '2026-03-04', time: '12:00 PM', hall: 'Hall D', format: '2D', availableSeats: 72 },
  { id: 's13', movieId: '2', date: '2026-03-04', time: '05:30 PM', hall: 'Hall E', format: 'Dolby', availableSeats: 18 },
  { id: 's14', movieId: '3', date: '2026-03-03', time: '09:30 AM', hall: 'Hall F', format: 'IMAX', availableSeats: 35 },
  { id: 's15', movieId: '3', date: '2026-03-03', time: '01:00 PM', hall: 'Hall F', format: 'IMAX', availableSeats: 22 },
  { id: 's16', movieId: '3', date: '2026-03-03', time: '05:00 PM', hall: 'Hall G', format: '3D', availableSeats: 48 },
  { id: 's17', movieId: '3', date: '2026-03-04', time: '10:00 AM', hall: 'Hall F', format: 'IMAX', availableSeats: 50 },
  { id: 's18', movieId: '3', date: '2026-03-04', time: '02:00 PM', hall: 'Hall G', format: '3D', availableSeats: 33 },
  { id: 's19', movieId: '4', date: '2026-03-03', time: '12:00 PM', hall: 'Hall H', format: '2D', availableSeats: 80 },
  { id: 's20', movieId: '4', date: '2026-03-03', time: '03:30 PM', hall: 'Hall H', format: '2D', availableSeats: 55 },
  { id: 's21', movieId: '4', date: '2026-03-04', time: '01:00 PM', hall: 'Hall H', format: '2D', availableSeats: 70 },
  { id: 's22', movieId: '5', date: '2026-03-03', time: '09:00 AM', hall: 'Hall I', format: '2D', availableSeats: 44 },
  { id: 's23', movieId: '5', date: '2026-03-03', time: '11:30 PM', hall: 'Hall I', format: 'Dolby', availableSeats: 25 },
  { id: 's24', movieId: '5', date: '2026-03-04', time: '08:30 PM', hall: 'Hall I', format: 'Dolby', availableSeats: 17 }
];

export const TICKET_PRICES = { IMAX: 18.99, '3D': 14.99, Dolby: 16.99, '2D': 11.99 };

export const DATES = [
  { label: 'Today', value: '2026-03-03', display: 'Mar 3' },
  { label: 'Tomorrow', value: '2026-03-04', display: 'Mar 4' },
  { label: 'Wed', value: '2026-03-05', display: 'Mar 5' },
  { label: 'Thu', value: '2026-03-06', display: 'Mar 6' },
  { label: 'Fri', value: '2026-03-07', display: 'Mar 7' }
];