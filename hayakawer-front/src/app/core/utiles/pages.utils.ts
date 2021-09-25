const baseUrl = 'pages/';

export const pages = {
    pagesRef: {
        home: 1,
        profile: 2,
        users: 3,
        terrain: 4,
        addTerrain: 5,
        event: 6,
        addEvent: 7,
        publication: 8
    },
    pagesRoute: {
        home: baseUrl + '',
        profile: baseUrl + 'profile',
        users: baseUrl + 'users',
        terrain: baseUrl + 'terrain',
        addTerrain: baseUrl + 'terrain/add',
        event: baseUrl + 'event',
        addEvent: baseUrl + 'event/add',
        terrainDetail: baseUrl + 'terrain/detail',
        ownerCalendar: baseUrl + 'terrain/calendar'
    }
}