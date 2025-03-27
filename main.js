function generateDailyMealPlan(filteredFoodDB, targetCarbRatio, targetProteinRatio, targetFatRatio, totalKcal) {
    const riceOptions = filteredFoodDB.rice;
    const soupOptions = filteredFoodDB.soup;
    const sideDishOptions = filteredFoodDB.sideDish;

    if (!riceOptions.length || !soupOptions.length || sideDishOptions.length < 3) {
        return "선택 가능한 음식 종류가 부족합니다.";
    }

    let bestMealPlan = null;
    let minRatioDifference = Infinity;

    for (const rice of riceOptions) {
        for (const soup of soupOptions) {
            for (let i = 0; i < sideDishOptions.length; i++) {
                for (let j = i + 1; j < sideDishOptions.length; j++) {
                    for (let k = j + 1; k < sideDishOptions.length; k++) {
                        const side1 = sideDishOptions[i];
                        const side2 = sideDishOptions[j];
                        const side3 = sideDishOptions[k];

                        const breakfast = { rice, soup, sideDishes: [side1] };
                        const lunch = { rice, soup, sideDishes: [side2] };
                        const dinner = { rice, soup, sideDishes: [side3] };

                        const mealPlan = { breakfast, lunch, dinner };
                        const totalNutrients = calculateTotalNutrients(mealPlan);

                        if (Math.abs(totalNutrients.kcal - totalKcal) / totalKcal > 0.1) {
                            continue;
                        }

                        const carbRatio = totalNutrients.carb / totalNutrients.kcal;
                        const proteinRatio = totalNutrients.protein / totalNutrients.kcal;
                        const fatRatio = totalNutrients.fat / totalNutrients.kcal;

                        const currentRatioDifference =
                            Math.abs(carbRatio - targetCarbRatio) +
                            Math.abs(proteinRatio - targetProteinRatio) +
                            Math.abs(fatRatio - targetFatRatio);

                        if (currentRatioDifference < minRatioDifference) {
                            minRatioDifference = currentRatioDifference;
                            bestMealPlan = mealPlan;
                        }
                    }
                }
            }
        }
    }

    if (bestMealPlan) {
        return formatMealPlan(bestMealPlan);
    } else {
        return "주어진 조건에 맞는 식단을 찾을 수 없습니다.";
    }
}

function calculateTotalNutrients(mealPlan) {
    let totalKcal = 0;
    let totalCarb = 0;
    let totalProtein = 0;
    let totalFat = 0;

    for (const meal of Object.values(mealPlan)) {
        totalKcal += meal.rice.kcal + meal.soup.kcal;
        totalCarb += meal.rice.carb + meal.soup.carb;
        totalProtein += meal.rice.protein + meal.soup.protein;
        totalFat += meal.rice.fat + meal.soup.fat;

        for (const side of meal.sideDishes) {
            totalKcal += side.kcal;
            totalCarb += side.carb;
            totalProtein += side.protein;
            totalFat += side.fat;
        }
    }

    return { kcal: totalKcal, carb: totalCarb, protein: totalProtein, fat: totalFat };
}

function formatMealPlan(mealPlan) {
    let output = "## 오늘의 식단 ##\n\n";
    for (const mealName in mealPlan) {
        const meal = mealPlan[mealName];
        output += `### ${mealName.toUpperCase()} ###\n`;
        output += `- 밥: ${meal.rice.name}\n`;
        output += `- 국: ${meal.soup.name}\n`;
        output += `- 반찬:\n`;
        meal.sideDishes.forEach(side => {
            output += `  - ${side.name}\n`;
        });
        output += "\n";
    }
    const totalNutrients = calculateTotalNutrients(mealPlan);
    const carbRatio = (totalNutrients.carb / totalNutrients.kcal * 100).toFixed(1);
    const proteinRatio = (totalNutrients.protein / totalNutrients.kcal * 100).toFixed(1);
    const fatRatio = (totalNutrients.fat / totalNutrients.kcal * 100).toFixed(1);

    output += "### 영양 정보 (하루 총합) ###\n";
    output += `- 총 칼로리: ${totalNutrients.kcal} kcal\n`;
    output += `- 탄수화물: ${totalNutrients.carb} g (${carbRatio}%)\n`;
    output += `- 단백질: ${totalNutrients.protein} g (${proteinRatio}%)\n`;
    output += `- 지방: ${totalNutrients.fat} g (${fatRatio}%)\n`;

    return output;
}

function inputValueConfirm() {
    const foodDB = {
        "rice": [
            {
                "name": "흰쌀밥",
                "kcal": 300,
                "carb": 65,
                "protein": 5,
                "fat": 1,
                "allergies": []
            },
            {
                "name": "현미밥",
                "kcal": 320,
                "carb": 68,
                "protein": 7,
                "fat": 2,
                "allergies": []
            },
            {
                "name": "잡곡밥",
                "kcal": 310,
                "carb": 66,
                "protein": 6,
                "fat": 1.5,
                "allergies": []
            },
            {
                "name": "보리밥",
                "kcal": 315,
                "carb": 67,
                "protein": 6,
                "fat": 1,
                "allergies": ["밀"]
            },
            {
                "name": "콩밥",
                "kcal": 330,
                "carb": 65,
                "protein": 8,
                "fat": 2,
                "allergies": ["콩"]
            }
        ],
        "soup": [
            {
                "name": "미역국",
                "kcal": 80,
                "carb": 5,
                "protein": 3,
                "fat": 5,
                "allergies": []
            },
            {
                "name": "된장찌개",
                "kcal": 120,
                "carb": 8,
                "protein": 7,
                "fat": 7,
                "allergies": ["콩"]
            },
            {
                "name": "김치찌개",
                "kcal": 150,
                "carb": 10,
                "protein": 8,
                "fat": 9,
                "allergies": []
            },
            {
                "name": "콩나물국",
                "kcal": 50,
                "carb": 4,
                "protein": 3,
                "fat": 2,
                "allergies": ["콩"]
            },
            {
                "name": "계란국",
                "kcal": 70,
                "carb": 3,
                "protein": 5,
                "fat": 4,
                "allergies": ["달걀"]
            },
            {
                "name": "순두부찌개",
                "kcal": 130,
                "carb": 9,
                "protein": 8,
                "fat": 8,
                "allergies": ["콩"]
            },
            {
                "name": "육개장",
                "kcal": 200,
                "carb": 12,
                "protein": 15,
                "fat": 10,
                "allergies": []
            },
            {
                "name": "갈비탕",
                "kcal": 300,
                "carb": 15,
                "protein": 20,
                "fat": 18,
                "allergies": []
            },
            {
                "name": "어묵탕",
                "kcal": 180,
                "carb": 10,
                "protein": 10,
                "fat": 12,
                "allergies": ["생선"]
            },
            {
                "name": "닭개장",
                "kcal": 190,
                "carb": 10,
                "protein": 18,
                "fat": 9,
                "allergies": []
            },
            {
                "name": "시금치 된장국",
                "kcal": 90,
                "carb": 6,
                "protein": 5,
                "fat": 5,
                "allergies": ["콩"]
            },
            {
                "name": "무국",
                "kcal": 60,
                "carb": 4,
                "protein": 2,
                "fat": 4,
                "allergies": []
            }
        ],
        "sideDish": [
            {
                "name": "계란후라이",
                "kcal": 90,
                "carb": 1,
                "protein": 7,
                "fat": 6,
                "allergies": ["달걀"]
            },
            {
                "name": "김치",
                "kcal": 20,
                "carb": 3,
                "protein": 1,
                "fat": 0.5,
                "allergies": []
            },
            {
                "name": "두부조림",
                "kcal": 100,
                "carb": 6,
                "protein": 8,
                "fat": 5,
                "allergies": ["콩"]
            },
            {
                "name": "멸치볶음",
                "kcal": 80,
                "carb": 5,
                "protein": 7,
                "fat": 4,
                "allergies": ["생선"]
            },
            {
                "name": "시금치나물",
                "kcal": 40,
                "carb": 3,
                "protein": 2,
                "fat": 2,
                "allergies": []
            },
            {
                "name": "제육볶음",
                "kcal": 250,
                "carb": 10,
                "protein": 20,
                "fat": 15,
                "allergies": []
            },
            {
                "name": "고등어구이",
                "kcal": 200,
                "carb": 0,
                "protein": 25,
                "fat": 10,
                "allergies": ["생선"]
            },
            {
                "name": "오이무침",
                "kcal": 30,
                "carb": 5,
                "protein": 0.5,
                "fat": 0.5,
                "allergies": []
            },
            {
                "name": "잡채",
                "kcal": 150,
                "carb": 20,
                "protein": 5,
                "fat": 5,
                "allergies": ["콩"]
            },
            {
                "name": "계란말이",
                "kcal": 120,
                "carb": 3,
                "protein": 8,
                "fat": 8,
                "allergies": ["달걀"]
            },
            {
                "name": "콩자반",
                "kcal": 110,
                "carb": 15,
                "protein": 7,
                "fat": 3,
                "allergies": ["콩"]
            },
            {
                "name": "나물무침 (고사리)",
                "kcal": 50,
                "carb": 5,
                "protein": 2,
                "fat": 3,
                "allergies": []
            },
            {
                "name": "김치전",
                "kcal": 180,
                "carb": 20,
                "protein": 5,
                "fat": 8,
                "allergies": ["밀"]
            },
            {
                "name": "호박전",
                "kcal": 150,
                "carb": 15,
                "protein": 3,
                "fat": 7,
                "allergies": ["밀"]
            },
            {
                "name": "생선조림 (갈치)",
                "kcal": 180,
                "carb": 8,
                "protein": 20,
                "fat": 8,
                "allergies": ["생선"]
            },
            {
                "name": "오징어채볶음",
                "kcal": 160,
                "carb": 12,
                "protein": 15,
                "fat": 7,
                "allergies": ["갑각류"]
            },
            {
                "name": "미역줄기볶음",
                "kcal": 60,
                "carb": 8,
                "protein": 1,
                "fat": 3,
                "allergies": []
            },
            {
                "name": "숙주나물",
                "kcal": 35,
                "carb": 4,
                "protein": 2,
                "fat": 1,
                "allergies": []
            },
            {
                "name": "무생채",
                "kcal": 45,
                "carb": 6,
                "protein": 1,
                "fat": 2,
                "allergies": []
            },
            {
                "name": "애호박볶음",
                "kcal": 70,
                "carb": 7,
                "protein": 1,
                "fat": 4,
                "allergies": []
            },
            {
                "name": "감자조림",
                "kcal": 130,
                "carb": 25,
                "protein": 2,
                "fat": 3,
                "allergies": []
            },
            {
                "name": "버섯볶음",
                "kcal": 65,
                "carb": 5,
                "protein": 3,
                "fat": 4,
                "allergies": []
            },
            {
                "name": "꽈리고추 멸치볶음",
                "kcal": 90,
                "carb": 7,
                "protein": 8,
                "fat": 4,
                "allergies": ["생선"]
            },
            {
                "name": "비엔나소시지볶음",
                "kcal": 220,
                "carb": 5,
                "protein": 10,
                "fat": 18,
                "allergies": []
            },
            {
                "name": "어묵볶음",
                "kcal": 170,
                "carb": 10,
                "protein": 8,
                "fat": 12,
                "allergies": ["생선"]
            },
            {
                "name": "마늘쫑무침",
                "kcal": 55,
                "carb": 7,
                "protein": 1,
                "fat": 2,
                "allergies": []
            },
            {
                "name": "브로콜리 데침",
                "kcal": 30,
                "carb": 4,
                "protein": 3,
                "fat": 0.5,
                "allergies": []
            },
            {
                "name": "단무지",
                "kcal": 60,
                "carb": 14,
                "protein": 0.5,
                "fat": 0.1,
                "allergies": []
            },
            {
                "name": "깻잎 장아찌",
                "kcal": 70,
                "carb": 10,
                "protein": 1,
                "fat": 3,
                "allergies": []
            },
            {
                "name": "파래무침",
                "kcal": 40,
                "carb": 6,
                "protein": 1,
                "fat": 1,
                "allergies": []
            },
            {
                "name": "양파 장아찌",
                "kcal": 50,
                "carb": 12,
                "protein": 0.3,
                "fat": 0.1,
                "allergies": []
            },
            {
                "name": "취나물 무침",
                "kcal": 40,
                "carb": 6,
                "protein": 2,
                "fat": 1,
                "allergies": []
            },
            {
                "name": "고추 장아찌",
                "kcal": 60,
                "carb": 14,
                "protein": 1,
                "fat": 0.5,
                "allergies": []
            }
        ]
    };

    const checkBoxValue = document.querySelectorAll('input[name="allergy"]:checked');

    const userAllergies = [];
    checkBoxValue.forEach((item) => {
        userAllergies.push(item.value);
    });

    const userKcal = document.getElementById("kcal").value;

    //userKcal 변수 데이터 미 입력 감지
    if (!userKcal) {
        alert("kcal 값을 입력해주세요.");
        return false;
    }
    
    // 사용자 알레르기 필터링
    const filteredDB = {
        rice: foodDB.rice.filter(item => !item.allergies.some(allergy => userAllergies.includes(allergy))),
        soup: foodDB.soup.filter(item => !item.allergies.some(allergy => userAllergies.includes(allergy))),
        sideDish: foodDB.sideDish.filter(item => !item.allergies.some(allergy => userAllergies.includes(allergy))),
    };
    
    //탄단지 비율 (5:2:3)
    const targetCarb = 0.5;
    const targetProtein = 0.2;
    const targetFat = 0.3;

    const mealPlanResult = generateDailyMealPlan(filteredDB, targetCarb, targetProtein, targetFat, userKcal);
    document.getElementById("result").innerText = mealPlanResult;
}