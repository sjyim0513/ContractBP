import React, { useState, useEffect } from 'react';
import axios from 'axios';

function mapTeamsToSVG(teams) {
    if (!teams || teams.length === 0) return [];
    
    const mappings = [
      [], // 0팀 (사용하지 않음)
      [], // 1팀 (사용하지 않음)
      [{ x: 350, y: 125, name: "승자 9" }, { x: 350, y: 325, name: "승자 10" }],
      [{ x: 200, y: 75, name: "승자 1" }, { x: 200, y: 275, name: "승자 3" }, { x: 200, y: 175, name: "승자 2" }],
      [{ x: 200, y: 75, name: "승자 1" }, { x: 200, y: 275, name: "승자 3" }, { x: 200, y: 175, name: "승자 2" }, { x: 200, y: 375, name: "승자 4" }],
      [{ x: 50, y: 50, name: "팀 1" }, { x: 50, y: 250, name: "팀 5" }, { x: 50, y: 150, name: "팀 3" }, { x: 50, y: 350, name: "팀 7" }, { x: 50, y: 100, name: "팀 2" }],
      [{ x: 50, y: 50, name: "팀 1" }, { x: 50, y: 250, name: "팀 5" }, { x: 50, y: 150, name: "팀 3" }, { x: 50, y: 350, name: "팀 7" }, { x: 50, y: 100, name: "팀 2" }, { x: 50, y: 300, name: "팀 6" }],
      [{ x: 50, y: 50, name: "팀 1" }, { x: 50, y: 250, name: "팀 5" }, { x: 50, y: 150, name: "팀 3" }, { x: 50, y: 350, name: "팀 7" }, { x: 50, y: 100, name: "팀 2" }, { x: 50, y: 300, name: "팀 6" }, { x: 50, y: 200, name: "팀 4" }],
      [{ x: 50, y: 50, name: "팀 1" }, { x: 50, y: 250, name: "팀 5" }, { x: 50, y: 150, name: "팀 3" }, { x: 50, y: 350, name: "팀 7" }, { x: 50, y: 100, name: "팀 2" }, { x: 50, y: 300, name: "팀 6" }, { x: 50, y: 200, name: "팀 4" }, { x: 50, y: 400, name: "팀 8" }]
    ];
  
    const teamCount = teams.length;
    const mapping = mappings[teamCount] || [];
  
    return mapping.map((position, index) => ({
      ...position,
      name: teams[index] || position.name
    }));
}
  
function TournamentBracketSVG({sport}) {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        fetchTeams(sport);
    }, [sport]);

    const fetchTeams = async (sportType) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/teams/${sportType}`);
            const teamNames = response.data.data.map(team => team.name);
            setTeams(teamNames);
        } catch (error) {
            console.error('Error fetching ${sportType} teams:', error);
        }
    };

    const mappedTeams = mapTeamsToSVG(teams);

    const staticTeams = [
        // 좌측 팀
        ...Array(8).fill().map((_, i) => ({ x: 50, y: 50 + i * 50, name: `팀 ${i + 1}` })),
        // 우측 팀
        ...Array(8).fill().map((_, i) => ({ x: 1067, y: 50 + i * 50, name: `팀 ${i + 9}` })),
        // 좌측 하단 팀
        ...Array(8).fill().map((_, i) => ({ x: 50, y: 650 + i * 50, name: `팀 ${i + 17}` })),
        // 우측 하단 팀
        ...Array(8).fill().map((_, i) => ({ x: 1067, y: 650 + i * 50, name: `팀 ${i + 25}` })),
    ];

    const winners = [
        // 2차전 승자
        ...Array(4).fill().map((_, i) => ({ x: 200, y: 75 + i * 100, name: `승자 ${i + 1}` })),
        ...Array(4).fill().map((_, i) => ({ x: 200, y: 675 + i * 100, name: `승자 ${i + 5}` })),
        // 3차전 승자
        ...Array(2).fill().map((_, i) => ({ x: 350, y: 125 + i * 200, name: `승자 ${i + 9}` })),
        ...Array(2).fill().map((_, i) => ({ x: 350, y: 725 + i * 200, name: `승자 ${i + 11}` })),
        // 우측 2차전 승자
        ...Array(4).fill().map((_, i) => ({ x: 917, y: 75 + i * 100, name: `승자 ${i + 13}` })),
        ...Array(4).fill().map((_, i) => ({ x: 917, y: 675 + i * 100, name: `승자 ${i + 17}` })),
        // 우측 3차전 승자
        ...Array(2).fill().map((_, i) => ({ x: 767, y: 125 + i * 200, name: `승자 ${i + 21}` })),
        ...Array(2).fill().map((_, i) => ({ x: 767, y: 725 + i * 200, name: `승자 ${i + 23}` })),
    ];

    const finals = [
        { x: 500, y: 225, name: "준결승 1" },
        { x: 617, y: 225, name: "준결승 2" },
        { x: 500, y: 825, name: "준결승 3" },
        { x: 617, y: 825, name: "준결승 4" }
    ];

    const generateLines = () => {
        const lines = [];
        // 좌상단 1차전 -> 2차전 선들
        for (let i = 0; i < 4; i++) {
            lines.push(`150,${65 + i * 100} 175,${65 + i * 100} 175,${90 + i * 100} 200,${90 + i * 100}`);
            lines.push(`150,${115 + i * 100} 175,${115 + i * 100} 175,${90 + i * 100} 200,${90 + i * 100}`);
        }
        // 좌상단 2차전 -> 3차전 선들
        for (let i = 0; i < 2; i++) {
            lines.push(`300,${90 + i * 200} 325,${90 + i * 200} 325,${140 + i * 200} 350,${140 + i * 200}`);
            lines.push(`300,${190 + i * 200} 325,${190 + i * 200} 325,${140 + i * 200} 350,${140 + i * 200}`);
        }
        // 좌상단 3차전 -> 준결승 선들
        lines.push("450,140 475,140 475,240 500,240");
        lines.push("450,340 475,340 475,240 500,240");

        // 우상단 선들 (대칭)
        for (let i = 0; i < 4; i++) {
            lines.push(`1067,${65 + i * 100} 1042,${65 + i * 100} 1042,${90 + i * 100} 1017,${90 + i * 100}`);
            lines.push(`1067,${115 + i * 100} 1042,${115 + i * 100} 1042,${90 + i * 100} 1017,${90 + i * 100}`);
        }
        for (let i = 0; i < 2; i++) {
            lines.push(`917,${90 + i * 200} 892,${90 + i * 200} 892,${140 + i * 200} 867,${140 + i * 200}`);
            lines.push(`917,${190 + i * 200} 892,${190 + i * 200} 892,${140 + i * 200} 867,${140 + i * 200}`);
        }
        lines.push("767,140 742,140 742,240 717,240");
        lines.push("767,340 742,340 742,240 717,240");

        // 하단 부분 선들 (위와 유사하지만 y 좌표 600 증가)
        // 좌하단 1차전 -> 2차전 선들
        for (let i = 0; i < 4; i++) {
            lines.push(`150,${665 + i * 100} 175,${665 + i * 100} 175,${690 + i * 100} 200,${690 + i * 100}`);
            lines.push(`150,${715 + i * 100} 175,${715 + i * 100} 175,${690 + i * 100} 200,${690 + i * 100}`);
        }
        // 좌하단 2차전 -> 3차전 선들
        for (let i = 0; i < 2; i++) {
            lines.push(`300,${690 + i * 200} 325,${690 + i * 200} 325,${740 + i * 200} 350,${740 + i * 200}`);
            lines.push(`300,${790 + i * 200} 325,${790 + i * 200} 325,${740 + i * 200} 350,${740 + i * 200}`);
        }
        // 좌하단 3차전 -> 준결승 선들
        lines.push("450,740 475,740 475,840 500,840");
        lines.push("450,940 475,940 475,840 500,840");

        // 우하단 선들 (대칭)
        for (let i = 0; i < 4; i++) {
            lines.push(`1067,${665 + i * 100} 1042,${665 + i * 100} 1042,${690 + i * 100} 1017,${690 + i * 100}`);
            lines.push(`1067,${715 + i * 100} 1042,${715 + i * 100} 1042,${690 + i * 100} 1017,${690 + i * 100}`);
        }
        for (let i = 0; i < 2; i++) {
            lines.push(`917,${690 + i * 200} 892,${690 + i * 200} 892,${740 + i * 200} 867,${740 + i * 200}`);
            lines.push(`917,${790 + i * 200} 892,${790 + i * 200} 892,${740 + i * 200} 867,${740 + i * 200}`);
        }
        lines.push("767,740 742,740 742,840 717,840");
        lines.push("767,940 742,940 742,840 717,840");
        // 중앙 결승전 선들
        lines.push("600,240 617,240", "600,840 617,840", "608,240 608,840");

        return lines;
    };

    const lines = generateLines();

    const renderRect = (item, index) => (
        <g key={index}>
            <rect x={item.x} y={item.y} width="100" height="30" fill="lightgray" />
            <text x={item.x + 50} y={item.y + 20} fill="black" textAnchor="middle">{item.name}</text>
        </g>
    );

    return (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 1200"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            {staticTeams.map(renderRect)}
            {mappedTeams.map(renderRect)}
            {winners.map(renderRect)}
            {finals.map(renderRect)}
            {lines.map((points, index) => (
                <polyline key={index} points={points} stroke="black" fill="none" />
            ))}
            <g>
                <rect x="560" y="400" width="100" height="30" fill="lightgray" />
                <text x="610" y="420" fill="black" textAnchor="middle">팀 32</text>
            </g>
            <g>
                <rect x="560" y="650" width="100" height="30" fill="lightgray" />
                <text x="610" y="670" fill="black" textAnchor="middle">팀 33</text>
            </g>
            <g>
                <rect x="567" y="525" width="80" height="30" fill="white" />
                <text x="607" y="545" fill="black" fontSize="20" textAnchor="middle">VS</text>
            </g>
        </svg>
    );
}

export default TournamentBracketSVG;