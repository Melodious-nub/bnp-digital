export const DIVISIONS = [
    { id: 1, name: 'Dhaka' },
    { id: 2, name: 'Chittagong' },
    { id: 3, name: 'Sylhet' },
    { id: 4, name: 'Khulna' },
    { id: 5, name: 'Barishal' },
    { id: 6, name: 'Rajshahi' },
    { id: 7, name: 'Rangpur' }
];

export const DISTRICTS = [
    { id: 1, division_id: 1, name: 'Dhaka' },
    { id: 2, division_id: 1, name: 'Gazipur' },
    { id: 3, division_id: 1, name: 'Manikganj' },
    { id: 4, division_id: 1, name: 'Munshiganj' },
    { id: 5, division_id: 1, name: 'Narayanganj' },
    { id: 6, division_id: 1, name: 'Narsingdi' },
    { id: 7, division_id: 1, name: 'Faridpur' },
    { id: 8, division_id: 1, name: 'Gopalganj' },
    { id: 9, division_id: 1, name: 'Madaripur' },
    { id: 10, division_id: 1, name: 'Rajbari' },
    { id: 11, division_id: 1, name: 'Shariatpur' },
    { id: 12, division_id: 1, name: 'Kishoreganj' },
    { id: 13, division_id: 1, name: 'Tangail' },
    { id: 14, division_id: 1, name: 'Mymensingh' },
    { id: 15, division_id: 1, name: 'Jamalpur' },
    { id: 16, division_id: 1, name: 'Netrokona' },
    { id: 17, division_id: 1, name: 'Sherpur' },
    { id: 18, division_id: 2, name: 'Chittagong' },
    { id: 19, division_id: 2, name: 'Cox\'s Bazar' },
    { id: 20, division_id: 2, name: 'Rangamati' },
    { id: 21, division_id: 2, name: 'Bandarban' },
    { id: 22, division_id: 2, name: 'Khagrachhari' },
    { id: 23, division_id: 2, name: 'Noakhali' },
    { id: 24, division_id: 2, name: 'Feni' },
    { id: 25, division_id: 2, name: 'Lakshmipur' },
    { id: 26, division_id: 2, name: 'Comilla' },
    { id: 27, division_id: 2, name: 'Chandpur' },
    { id: 28, division_id: 2, name: 'Brahmanbaria' },
    { id: 29, division_id: 3, name: 'Sylhet' },
    { id: 30, division_id: 3, name: 'Moulvibazar' },
    { id: 31, division_id: 3, name: 'Habiganj' },
    { id: 32, division_id: 3, name: 'Sunamganj' },
    { id: 33, division_id: 4, name: 'Khulna' },
    { id: 34, division_id: 4, name: 'Bagerhat' },
    { id: 35, division_id: 4, name: 'Sathkhira' },
    { id: 36, division_id: 4, name: 'Jessore' },
    { id: 37, division_id: 4, name: 'Magura' },
    { id: 38, division_id: 4, name: 'Narail' },
    { id: 39, division_id: 4, name: 'Kushtia' },
    { id: 40, division_id: 4, name: 'Jhenaidah' },
    { id: 41, division_id: 4, name: 'Chuadanga' },
    { id: 42, division_id: 4, name: 'Meherpur' },
    { id: 43, division_id: 5, name: 'Barishal' },
    { id: 44, division_id: 5, name: 'Bhola' },
    { id: 45, division_id: 5, name: 'Patuakhali' },
    { id: 46, division_id: 5, name: 'Pirojpur' },
    { id: 47, division_id: 5, name: 'Jhalokati' },
    { id: 48, division_id: 5, name: 'Barguna' },
    { id: 49, division_id: 6, name: 'Rajshahi' },
    { id: 50, division_id: 6, name: 'Chapai Nawabganj' },
    { id: 51, division_id: 6, name: 'Naogaon' },
    { id: 52, division_id: 6, name: 'Natore' },
    { id: 53, division_id: 6, name: 'Pabna' },
    { id: 54, division_id: 6, name: 'Sirajganj' },
    { id: 55, division_id: 6, name: 'Bogra' },
    { id: 56, division_id: 6, name: 'Joypurhat' },
    { id: 57, division_id: 7, name: 'Rangpur' },
    { id: 58, division_id: 7, name: 'Gaibandha' },
    { id: 59, division_id: 7, name: 'Kurigram' },
    { id: 60, division_id: 7, name: 'Nilphamari' },
    { id: 61, division_id: 7, name: 'Lalmonirhat' },
    { id: 62, division_id: 7, name: 'Dinajpur' },
    { id: 63, division_id: 7, name: 'Thakurgaon' },
    { id: 64, division_id: 7, name: 'Panchagarh' }
];

// Helper to generate 300 candidates with realistic data
// Helper to generate 300 candidates with deterministic data (Seeded by Index)
const generateCandidates = () => {
    const candidates = [];
    const targetTotal = 300;

    // Dataset for realistic name generation
    const titles = ['Advocate', 'Barrister', 'Dr.', 'Engr.', 'Alhaj', 'Professor', 'Principal', 'Md.', 'Syed', 'Khandaker'];
    const firstNames = [
        'Mirza', 'Ruhul', 'Moshun', 'Gayeshwar', 'Abdul', 'Moyeen', 'Nazrul', 'Amir', 'Barkat', 'Shamsur',
        'Zainul', 'Altaf', 'Hafiz', 'Shahjahan', 'Rafiqul', 'Mizanur', 'Harun', 'Sadek', 'Tariqul', 'Lutfor',
        'Asaduzzaman', 'Moudud', 'Jamir', 'Nitai', 'Salahuddin', 'Zoynal', 'Rumin', 'Tabith', 'Ishraque',
        'Faruq', 'Enamul', 'Habibur', 'Mozammel', 'Anisul', 'Rezaul', 'Kamrul', 'Nasim', 'Obaidul'
    ];
    const lastNames = [
        'Fakhrul', 'Islam', 'Alamgir', 'Hossain', 'Kabir', 'Rizvi', 'Abbas', 'Chandra Roy', 'Khan',
        'Awal', 'Mintoo', 'Dulu', 'Malik', 'Ahmed', 'Tuku', 'Bhuiyan', 'Chowdhury', 'Sarkar', 'Uddin',
        'Mamun', 'Huda', 'Rahman', 'Haider', 'Siddique', 'Aziz', 'Mollah', 'Gazi', 'Sheikh', 'Mondol',
        'Khatun', 'Begum', 'Akter', 'Banerjee', 'Das', 'Pramanik', 'Talukder', 'Majumdar'
    ];

    const designations = [
        'District President', 'General Secretary', 'Organizing Secretary', 'Senior Joint Secretary',
        'Vice President', 'Member of Parliament (Nominee)', 'Executive Member', 'Youth Wing Coordinator',
        'Student Affairs Secretary', 'Social Welfare Secretary'
    ];

    const bioTemplates = [
        "A dedicated leader committed to restoring democracy and law in {district}.",
        "Serving the people of {district} for over two decades with integrity and passion.",
        "Focusing on educational reforms, unemployment reduction, and infrastructure development in {district}.",
        "A strong voice for judicial independence and economic transparency.",
        "Championing the rights of farmers and laborers in the {division} region.",
        "Advocating for digital transformation and youth empowerment across {district}."
    ];

    // Deterministic picker
    // Additional Data for Rich Profile
    const activityTypes = ['Rally', 'Meeting', 'Press', 'Community'];
    const activityTitles = [
        "Mass gathering at {location} Stadium",
        "Press Briefing on {topic}",
        "Community Outreach in {location}",
        "Strategic Meeting with Local Leaders",
        "Youth Engagement Summit",
        "Relief Distribution Program"
    ];
    const topics = ["Economic Reform", "Digital Rights", "Infrastructure", "Education", "Healthcare"];

    // Deterministic picker
    const pick = (arr: any[], seed: number) => arr[seed % arr.length];

    let districtIndex = 0;

    for (let i = 1; i <= targetTotal; i++) {
        // Cycle through districts
        const dist = DISTRICTS[districtIndex];
        const div = DIVISIONS.find(d => d.id === dist.division_id);
        const divName = div ? div.name : 'Bangladesh';

        const title = (i % 3 === 0) ? pick(titles, i) + ' ' : '';
        const first = pick(firstNames, i);
        const last = pick(lastNames, i + 7);
        const fullName = `${title}${first} ${last}`;
        const slug = fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        const role = pick(designations, i + 3);

        const bio = pick(bioTemplates, i + 5)
            .replace('{district}', dist.name)
            .replace('{division}', divName);

        // Generate Campaign Images (Deterministic Placeholders)
        const campaignImages = [
            `https://placehold.co/800x600/004d3b/ffffff?text=Campaign+Rally+${i}`,
            `https://placehold.co/800x600/1f2937/4ade80?text=Community+Meeting`,
            `https://placehold.co/800x600/004d3b/e5e7eb?text=Press+Conference`,
            `https://placehold.co/800x600/111827/ffffff?text=Field+Visit`
        ];

        // Generate Recent Activity
        const recentActivity = [];
        for (let j = 0; j < 3; j++) {
            const seed = i + j * 55;
            const type = pick(activityTypes, seed) as 'Rally' | 'Meeting' | 'Press' | 'Community';
            const actTitle = pick(activityTitles, seed)
                .replace('{location}', dist.name)
                .replace('{topic}', pick(topics, seed));

            recentActivity.push({
                id: j + 1,
                date: new Date(2025, 11, 28 - j * 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                title: actTitle,
                excerpt: `Candidate ${last} addressed the crowd regarding the future of ${divName}, emphasizing the need for unity and progress.`,
                image_url: `https://placehold.co/600x400/006a4e/ffffff?text=${type}+Event`,
                type: type
            });
        }

        // Generate Stats
        const stats = {
            followers: ((i * 1234) % 500 + 10).toString() + 'K', // e.g. 150K
            volunteers: ((i * 789) % 2000 + 500).toString(),
            events_held: (i * 37) % 100 + 20
        };

        // Generate Manifesto
        const manifesto = {
            title: `Vision 2026 for ${dist.name}`,
            points: [
                `Establish a specialized technical university in ${dist.name}.`,
                `Upgrade the ${divName} highway connection specifically for ${dist.name} commuters.`,
                `Launch a '${dist.name} Digital Hub' to employ 5,000 local youths.`,
                `Ensure 100% clean water access across all ${dist.name} upazilas.`
            ]
        };

        candidates.push({
            id: i,
            full_name: fullName,
            slug: slug,
            division_id: dist.division_id,
            district_id: dist.id,
            division_name: divName,
            district_name: dist.name,
            designation: role,
            photo_url: `https://i.pravatar.cc/400?u=${i + 600}`,
            bio: bio,
            campaign_images: campaignImages,
            recent_activity: recentActivity,
            stats: stats,
            manifesto: manifesto
        });

        // Move to next district
        districtIndex = (districtIndex + 1) % DISTRICTS.length;
    }

    return candidates;
};

export const CANDIDATES = generateCandidates();
