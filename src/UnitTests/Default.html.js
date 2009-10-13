/// <reference path="qunit.js" />
/// <reference path="../linq2js.js" />

var AnimalType = {
    Dog: 1,
    Cat: 2,
    Fish: 3,
    Goat: 4
}

var numbers0To9InOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var numbers10To19InOrder = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

var animals = [];
animals.push({ type: AnimalType.Dog, name: "Rover", age: 13, children: [] });
animals.push({ type: AnimalType.Cat, name: "Fluffy", age: 1, children: [] });
animals.push({ type: AnimalType.Dog, name: "Rex", age: 12, children: ["Rover"] });
animals.push({ type: AnimalType.Fish, name: "Goldie", age: 3, children: ["Scales", "Goldie"] });
animals.push({ type: AnimalType.Cat, name: "Fudge", age: 20, children: ["Digby", "Kitty"] });
animals.push({ type: AnimalType.Cat, name: "Digby", age: 2, children: [] });
animals.push({ type: AnimalType.Cat, name: "Kitty", age: 4, children: [] });
animals.push({ type: AnimalType.Dog, name: "Rover", age: 3, children: [] });
animals.push({ type: AnimalType.Fish, name: "Scales", age: 2, children: [] });
animals.push({ type: AnimalType.Fish, name: "Goldie", age: 1, children: [] });

var pets = [];
pets.push({ type: AnimalType.Dog, name: "Rover", age: 13, children: [] });
pets.push({ type: AnimalType.Fish, name: "Goldie", age: 1, children: [] });
pets.push({ type: AnimalType.Cat, name: "Digby", age: 2, children: ["Felix"] });

module("Enumerable Init");

test("Create an enumerable without a parameter", function() {
    var result = $e();

    equals(result.count(), 0, "Result has no elements");
});

test("Create an enumerable from an array", function() {
    var result = $e(numbers0To9InOrder);

    equals(result.count(), 10, "Result has elements");
});

test("Create an enumerable from an object thats not an array", function() {
    var result = $e({ type: AnimalType.Dog, name: "Rover", age: 13, children: [] });

    equals(result.count(), 4, "Result has elements");
});

module("Enumerable Add");

test("Add simple type", function() {
    var t = $e(numbers0To9InOrder);
    equals(t.count(), 10, "Before adding contains expected number of elements");
    t.add(11);
    equals(t.count(), 11, "After adding contains expected number of elements");
});

test("Add complex type", function() {
    var t = $e(animals);
    equals(t.count(), 10, "Before adding contains expected number of elements");
    t.add({ type: AnimalType.Fish, name: "Bubbles", age: 10, children: [] });
    equals(t.count(), 11, "After adding contains expected number of elements");
});

module("Enumerable AddRange");

test("Add Array of simple types", function() {
    var t = $e(numbers0To9InOrder);
    equals(t.count(), 10, "Before adding contains expected number of elements");
    t.addRange([11, 12, 13]);
    equals(t.count(), 13, "After adding contains expected number of elements");
});

test("Add Enumerable of simple types", function() {
    var t = $e(numbers0To9InOrder);
    equals(t.count(), 10, "Before adding contains expected number of elements");
    t.addRange($e([11, 12, 13]));
    equals(t.count(), 13, "After adding contains expected number of elements");
});

module("Enumerable All");

test("All Array items of simple type", function() {
    var value = $e(numbers0To9InOrder).all(function(item) {
        return item >= 0;
    });
    equals(value, true, "All items in Array are greater than 0");

    var value = $e(numbers0To9InOrder).all(function(item) {
        return item > 1;
    });
    equals(value, false, "All items in Array are greater than 1");
});

test("All Enumerable items of complex type", function() {
    var value = $e(animals).all(function(item) {
        return item.age >= 1;
    });
    equals(value, true, "All items in Enumerable are 1 or older");

    var value = $e(animals).all(function(item) {
        return item.age >= 5;
    });
    equals(value, false, "All items in Enumerable are 5 or older");
});

module("Enumerable Any");

test("Any Array items of simple type", function() {
    var value = $e(numbers0To9InOrder).any(function(item) {
        return item > 6;
    });
    equals(value, true, "Any items in Array are greater than 6");

    var value = $e(numbers0To9InOrder).any(function(item) {
        return item < 0;
    });
    equals(value, false, "Any items in Array are less than 0");
});

test("Any Enumerable items of complex type", function() {
    var value = $e(animals).any(function(item) {
        return item.type === AnimalType.Fish;
    });
    equals(value, true, "Any items in Enumerable are Fish");

    var value = $e(animals).any(function(item) {
        return item.type === AnimalType.Goat;
    });
    equals(value, false, "Any items in Enumerable are Goats");
});

module("Enumerable Average");

test("Average Array items of simple integers", function() {
    var value = $e(numbers0To9InOrder).average();
    equals(value, 4.5, "Average value in Array is 4.5");
});

test("Average Array items of complex object", function() {
    var value = $e(animals).average(function(item) {
        return item.age;
    });
    equals(value, 6.1, "Average value in Array is 6.1");
});

module("Enumerable Clear");

test("Clear items", function() {
    var t = $e(numbers0To9InOrder);
    equals(t.count() != 0, true, "Enumerable is not empty");
    t.clear();
    equals(t.count(), 0, "Enumerable has been cleared");
    equals(t.expressions.length, 0, "Enumerable expressions have been cleared");
    equals(numbers0To9InOrder.length > 0, true, "Source array still has items");
});

test("Clear items of query", function() {
    var t = $e(numbers0To9InOrder).where(function(item) {
        return item > 3;
    });

    equals(t.count() != 0, true, "Enumerable is not empty");
    equals(t.expressions.length, 1, "Enumerable contains expected number of expressions");

    t.clear();

    equals(t.count(), 0, "Enumerable has been cleared");
    equals(t.expressions.length, 0, "Enumerable expressions have been cleared");
    equals(numbers0To9InOrder.length > 0, true, "Source array still has items");
});

module("Enumerable Concat");

test("Concat with Array of simple types", function() {
    var t1 = $e(numbers0To9InOrder);

    equals(t1.count() === 10, true, "Source Enumerable is has 10 items");
    equals(numbers10To19InOrder.length === 10, true, "Second Array has 10 items");

    var result = t1.concat(numbers10To19InOrder).execute();

    equals(result.count(), 20, "Result has 20 items");
});

module("Enumerable Contains");

test("Contains simple type", function() {
    var value = $e(numbers0To9InOrder).contains(3);
    equals(value, true, "List contains the value");

    var value = $e(numbers0To9InOrder).contains(11);
    equals(value, false, "List doesn't contains the value");
});

test("Contains complex type", function() {
    var value = $e(animals).contains({ age: 4, type: AnimalType.Cat }, function(item1, item2) {
        return item1.age === item2.age && item1.type === item2.type;
    });
    equals(value, true, "List contains the value");

    var value = $e(animals).contains({ age: 3, type: AnimalType.Cat }, function(item1, item2) {
        return item1.age === item2.age && item1.type === item2.type;
    });
    equals(value, false, "List doesn't contains the value");
});

module("Enumerable Copy");

test("Copy the Enumerable of simple types", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.copy();

    equals(source.count() === result.count(), true, "Source Enumerable has the same number of items as result");
});

test("Copy the Enumerable query of simple types", function() {
    var source = $e(numbers0To9InOrder).where(function(item) {
        return item > 3;
    });

    equals(source.expressions.length, 1, "Source contains expected number of expressions");

    var result = source.copy();

    equals(source.count() === result.count(), true, "Source Enumerable has the same number of items as result");
    equals(source.count(), 6, "Source Enumerable has 6 items");
    equals(result.count(), 6, "Result Enumerable has 6 items");
    equals(source.expressions.length === result.expressions.length, true, "Source Enumerable has the same number of expressions as result");
});

module("Enumerable Count");

test("Count the number of items in Enumerable", function() {
    var value = $e(numbers0To9InOrder).count();

    equals(value, 10, "Enumerable contains 10 items");
});

test("Count the number of items in Enumerable with predicate", function() {
    var value = $e(numbers0To9InOrder).count(function(item) {
        return item <= 5;
    });

    equals(value, 6, "Enumerable contains 6 items left than or equal to 5");
});

module("Enumerable Distinct");

test("Get the distinct simple types", function() {
    var source = $e([0, 2, 2, 6, 2, 3, 9, 10, 5, 3, 4, 5, 1, 4]);

    equals(source.count(), 14, "Source Enumerable has 14 items");

    var distintValues = source.distinct();

    equals(distintValues.count(), 9, "Result Enumerable contains 9 items");
});

test("Get the distinct complex types", function() {
    var source = $e(animals);

    equals(source.count(), 10, "Source Enumerable has 10 items");

    var distintValues = source.distinct(function(item1, item2) {
        return item1.type === item2.type;
    });

    equals(distintValues.count(), 3, "Result Enumerable contains 3 unique animal types");
});

module("Enumerable Each");

test("Iterate through each item of Enumerable", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Source Enumerable has 10 items");

    var count = 0;
    source.each(function(item, index) {
        count++;
    });

    equals(count, 10, "Iterated through 10 items");
});

test("Iterate through each item of a queried Enumerable", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Source Enumerable has 10 items");

    source = source.where(function(item) {
        return item > 5;
    });

    var count = 0;
    source.each(function(item, index) {
        count++;
    });

    equals(count, 4, "Iterated through 4 items");
});

module("Enumerable ElementAt");

test("Get the element at an index", function() {
    var source = $e(numbers10To19InOrder);

    equals(source.count(), 10, "Source Enumerable has 10 items");
    equals(source.elementAt(3), 13, "Value at element 3 is 13");
    equals(source.elementAt(-1), undefined, "Value at element -1 is undefined");
    equals(source.elementAt(10), undefined, "Value at element 10 is undefined");
});

module("Enumerable Except");

test("Get the Enumerable simple type elements which aren't in a second Array", function() {
    var source = $e(numbers0To9InOrder);
    var second = [0, 2, 2, 6, 2, 3, 9, 10, 5, 3, 4, 5, 4];

    equals(source.count(), 10, "Source Enumerable has 10 items");
    equals(second.length, 13, "Second Array has 13 items");

    var result = source.except(second);

    equals(result.count(), 3, "Result contains 3 elements");
    equals(result.contains(1), true, "Result contains element with value 1");
    equals(result.contains(7), true, "Result contains element with value 7");
    equals(result.contains(8), true, "Result contains element with value 8");
    equals(result.contains(2), false, "Result doesn't contain element with value 2");
});

test("Get the Enumerable complex type elements which aren't in a second Array", function() {
    var source = $e(animals);
    var second = [];
    second.push({ type: AnimalType.Fish, name: "Scales", age: 2, children: [] });
    second.push({ type: AnimalType.Cat, name: "Kitty", age: 4, children: [] });

    equals(source.count(), 10, "Source Enumerable has 10 items");
    equals(second.length, 2, "Second Array has 2 items");

    var animalEqualityComparer = function(item1, item2) {
        return item1.type === item2.type && item1.name === item2.name && item1.age === item2.age;
    }

    var result = source.except(second, animalEqualityComparer);

    equals(result.count(), 8, "Result contains 8 elements");
    equals(result.contains(animals[0], animalEqualityComparer), true, "Result contains animal");
    equals(result.contains(animals[5], animalEqualityComparer), true, "Result contains animal");
    equals(result.contains(second[0], animalEqualityComparer), false, "Result doesn't contain animal");
    equals(result.contains(second[1], animalEqualityComparer), false, "Result doesn't contain animal");
});

module("Enumerable Execute");

test("Execute Enumerable.Where.Select", function() {
    var source = $e(animals);

    var result = source.where(function(item) {
        return item.age > 9;
    }).select(function(item) {
        return item.name + " is " + item.age + " years old";
    }).execute();

    equals(source.count(), 10, "Source Enumerable has 10 items");

    var animalEqualityComparer = function(item1, item2) {
        return item1.type === item2.type && item1.name === item2.name && item1.age === item2.age;
    }

    equals(result.count(), 3, "Result contains 3 elements");
    equals(result.contains('Rex is 12 years old'), true, "Result contains 'Rex is 12 years old'");
    equals(result.contains('Rover is 13 years old'), true, "Result contains 'Rex is 13 years old'");
    equals(result.contains('Fudge is 20 years old'), true, "Result contains 'Fudge is 20 years old'");
    equals(result.contains('Scales is 2 years old'), false, "Result contains 'Scales is 2 years old'");
});

module("Enumerable First");

test("First item in Enumerable", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.first();

    equals(result, 0, "Result is 0");
});

test("First item in an empty Enumerable", function() {
    var source = $e([]);
    var result = source.first();

    equals(result, undefined, "No first item exists in Enumerable");
});

test("First item in Enumerable with predicate", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.first(function(item) {
        return item > 4;
    });

    equals(result, 5, "Result is 5");
});

test("Non existing first item in Enumerable with predicate", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.first(function(item) {
        return item > 10;
    });

    equals(result, undefined, "No first item exists in Enumerable");
});

module("Enumerable FirstOrDefault");

test("FirstOrDefault item in Enumerable", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.firstOrDefault();

    equals(result, 0, "Result is 0");
});

test("FirstOrDefault item in an empty Enumerable", function() {
    var source = $e([]);
    var result = source.firstOrDefault(null, "default");

    equals(result, "default", "Default value of 'default'");
});

test("Non existing FirstOrDefault item in Enumerable with predicate", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.firstOrDefault(function(item) {
        return item > 10;
    }, "default");

    equals(result, "default", "No first item exists in Enumerable, expect 'default'");
});

module("Enumerable GroupBy");

test("GroupBy a simple type as key", function() {
    var source = $e(animals);
    var groupedByAnimalType = source.groupBy(function(item) {
        return item.type;
    })
    .execute();

    var numberOfGroups = groupedByAnimalType.count();
    equals(numberOfGroups, 3, "Result is 3");

    var keyAnimalEqualityComparer = function(item1, item2) {
        return item1.key === item2;
    };

    var containsCats = groupedByAnimalType.contains(AnimalType.Cat, keyAnimalEqualityComparer);
    equals(containsCats, true, "Grouped items contains cats");

    var containsDogs = groupedByAnimalType.contains(AnimalType.Dog, keyAnimalEqualityComparer);
    equals(containsDogs, true, "Grouped items contains dogs");

    var containsFish = groupedByAnimalType.contains(AnimalType.Fish, keyAnimalEqualityComparer);
    equals(containsFish, true, "Grouped items contains fish");

    var containsGoats = groupedByAnimalType.contains(AnimalType.Goat, keyAnimalEqualityComparer);
    equals(containsGoats, false, "Grouped items contains goats");

    var numberCats = 0;
    groupedByAnimalType.where(function(item) {
        return item.key === AnimalType.Cat;
    })
    .select(function(item) {
        return item.values;
    })
    .each(function(item) {
        numberCats += item.count();
    });
    equals(numberCats, 4, "Number of cats 4");

    var numberDogs = 0;
    groupedByAnimalType.where(function(item) {
        return item.key === AnimalType.Dog;
    })
    .select(function(item) {
        return item.values;
    })
    .each(function(item) {
        numberDogs += item.count();
    });
    equals(numberDogs, 3, "Number of dogs 3");

    var numberFish = 0;
    groupedByAnimalType.where(function(item) {
        return item.key === AnimalType.Fish;
    })
    .select(function(item) {
        return item.values;
    })
    .each(function(item) {
        numberFish += item.count();
    });
    equals(numberFish, 3, "Number of fish 3");
});

test("GroupBy a complex type as key", function() {
    var source = $e(animals);
    source.add({ type: AnimalType.Cat, name: "Fluffles", age: 2, children: [] });

    var groupedByAnimalType = source.groupBy(function(item) {
        return { type: item.type, age: item.age };
    }, function(item1, item2) {
        return item1.type === item2.type && item1.age === item2.age;
    });

    var numberOfGroups = groupedByAnimalType.count();
    equals(numberOfGroups, 10, "Result is 10");

    var numberCatsAged2 = 0;
    groupedByAnimalType.where(function(item) {
        return item.key.type === AnimalType.Cat && item.key.age === 2;
    })
    .each(function(item) {
        numberCatsAged2 += item.values.count();
    });

    equals(numberCatsAged2, 2, "Grouped items contains 2 cats aged 2");
});

module("Enumerable IndexOf");

test("IndexOf a simple type not occurring", function() {
    var source = $e([3, 2, 7, 1, 5, 6, 3, 4]);

    equals(source.indexOf(10), undefined, "Index of 10 is undefined");
});

test("IndexOf a simple type occurring once from beginning", function() {
    var source = $e([3, 2, 7, 1, 5, 6, 3, 4]);

    equals(source.indexOf(7), 2, "Index of 7 is 2");
});

test("IndexOf a simple type occurring twice from beginning", function() {
    var source = $e([3, 2, 7, 1, 5, 6, 3, 4]).concat([3, 2, 7, 1, 5, 6, 3, 4]);

    equals(source.indexOf(1), 3, "Index of 1 is 3");
});

test("IndexOf a simple type occurring once from position 2", function() {
    var source = $e([3, 2, 7, 1, 5, 6, 3, 4]).concat([3, 2, 7, 1, 5, 6, 3, 4]);

    equals(source.indexOf(1, 2), 3, "Index of 1 is 3");
});

test("IndexOf a simple type occurring once from beginning within 2 indexes", function() {
    var source = $e([3, 2, 7, 1, 5, 6, 3, 4]);

    equals(source.indexOf(7, null, 2), undefined, "Index of 7");
    equals(source.indexOf(7, undefined, 2), undefined, "Index of 7");
    equals(source.indexOf(2, null, 2), 1, "Index of 2");
    equals(source.indexOf(2, undefined, 2), 1, "Index of 2");
});

test("IndexOf a complex type occurring", function() {
    var result = $e(animals).orderBy(function(item) {
        return item.age;
    });

    equals(animals[3].children.length, 2, "Source expected result has children");
    equals(animals[3].name, "Goldie", "Source expected result name");
    equals(animals[3].age, 3, "Source expected result age");
    equals(result.elementAt(4).children.length, 2, "Result expected result has children");
    equals(result.elementAt(4).name, "Goldie", "Result expected result name");
    equals(result.elementAt(4).age, 3, "Result expected result age");
    equals(result.indexOf(animals[3]), 4, "Index of animal");
});

module("Enumerable Insert");

test("Insert an item", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.insert(4, 99);
    equals(result.indexOf(99), 4, "Index of 99");
});

test("Insert an item out of bounds of the source", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.insert(15, 99);
    equals(result.indexOf(99), 10, "Index of 99");

    var result = source.insert(-20, 99);
    equals(result.indexOf(99), 0, "Index of 99");
    equals(result.indexOf(0), 1, "Index of 0");
});

module("Enumerable InsertRange");

test("Insert a range of items", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.insertRange(0, [97, 98, 99]);
    equals(result.count(), 13, "Result contains a count of");
    equals(result.indexOf(97), 0, "Index of 97");
    equals(result.indexOf(98), 1, "Index of 98");
    equals(result.indexOf(99), 2, "Index of 99");
    equals(result.indexOf(0), 3, "Index of 0");
});

test("Insert a range of items at index", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.insertRange(6, [97, 98, 99]);
    equals(result.count(), 13, "Result contains a count of");
    equals(result.indexOf(97), 6, "Index of 97");
    equals(result.indexOf(98), 7, "Index of 98");
    equals(result.indexOf(99), 8, "Index of 99");
    equals(result.indexOf(6), 9, "Index of 6");
    equals(result.indexOf(0), 0, "Index of 0");
});

module("Enumerable Intersect");

test("Intersect an array of simple types", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.intersect([0, 5, 6]);

    equals(result.count(), 3, "Intersection contains a count of");
    equals(result.contains(0), true, "Result contains 0");
    equals(result.contains(5), true, "Result contains 5");
    equals(result.contains(6), true, "Result contains 6");
    equals(result.contains(7), false, "Result contains 7");
});

test("Intersect an array of complex types", function() {
    var source = $e(animals);

    var result = source.intersect(pets, function(item1, item2) {

        function areChildrenMatching() {
            var matchingChildren = true;
            $e(item1.children).each(function(item1Child) {
                if ($e(item2.children).contains(item1Child) === false) {
                    matchingChildren = false;
                    return;
                }
            });

            return matchingChildren;
        };

        return item1.type === item2.type &&
               item1.name === item2.name &&
               item1.age === item2.age &&
               areChildrenMatching();
    });

    equals(result.count(), 2, "Intersection contains a count of");
});

module("Enumerable Last");

test("Last item in Enumerable", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.last();

    equals(result, 9, "Result is");
});

test("Last item in an empty Enumerable", function() {
    var source = $e([]);
    var result = source.last();

    equals(result, undefined, "No last item exists in Enumerable");
});

test("Last item in Enumerable with predicate", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.last(function(item) {
        return item < 3;
    });

    equals(result, 2, "Result is");
});

test("Non existing last item in Enumerable with predicate", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.first(function(item) {
        return item < 0;
    });

    equals(result, undefined, "No last item exists in Enumerable");
});

module("Enumerable LastOrDefault");

test("LastOrDefault item in Enumerable", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.lastOrDefault();

    equals(result, 9, "Result");
});

test("LastOrDefault item in an empty Enumerable", function() {
    var source = $e([]);
    var result = source.lastOrDefault(null, "default");

    equals(result, "default", "Default value of 'default'");
});

test("Non existing LastOrDefault item in Enumerable with predicate", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.lastOrDefault(function(item) {
        return item < 0;
    }, "default");

    equals(result, "default", "No last item exists in Enumerable, expect 'default'");
});

module("Enumerable Max");

test("Max item in Enumerable of simple types", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.max();

    equals(result, 9, "Result");
});

test("Max item in Enumerable of complex types with selector", function() {
    var source = $e(animals);
    var result = source.max(function(item) {
        return item.age;
    });

    equals(result, 20, "Result");
});

module("Enumerable Min");

test("Min item in Enumerable of simple types", function() {
    var source = $e(numbers0To9InOrder);
    var result = source.min();

    equals(result, 0, "Result");
});

test("Min item in Enumerable of complex types with selector", function() {
    var source = $e(animals);
    var result = source.min(function(item) {
        return item.age;
    });

    equals(result, 1, "Result");
});

module("Enumerable OrderBy");

test("OrderBy Enumerable of simple types", function() {
    var source = $e([6, 2, 7, 3, 1]);
    var result = source.orderBy();
    var resultArray = result.toArray();

    equals(resultArray[0], 1, "Element 0");
    equals(resultArray[1], 2, "Element 1");
    equals(resultArray[2], 3, "Element 2");
    equals(resultArray[3], 6, "Element 3");
    equals(resultArray[4], 7, "Element 4");
});

test("OrderBy Enumerable of complex types", function() {
    var source = $e(pets);
    var result = source.orderBy(function(item) {
        return item.age;
    });
    var resultArray = result.toArray();

    equals(resultArray[0].age, 1, "Element 0");
    equals(resultArray[1].age, 2, "Element 1");
    equals(resultArray[2].age, 13, "Element 2");
});

test("OrderBy Enumerable of complex types", function() {
    var source = $e(pets);
    var result = source.orderBy(function(item1) {
        return item1.name;
    });
    var resultArray = result.toArray();

    equals(resultArray[0].name, "Digby", "Element 0");
    equals(resultArray[1].name, "Goldie", "Element 1");
    equals(resultArray[2].name, "Rover", "Element 2");
});

test("OrderBy Enumerable of complex types", function() {
    var source = $e(pets);

    var result = source.orderBy(null, function(item1, item2) {
        if (item1.name === item2.name) {
            return 0;
        } else if (item1.name < item2.name) {
            return -1;
        } else if (item2.name < item1.name) {
            return 1;
        }
    });
    var resultArray = result.toArray();

    equals(resultArray[0].name, "Digby", "Element 0");
    equals(resultArray[1].name, "Goldie", "Element 1");
    equals(resultArray[2].name, "Rover", "Element 2");
});

module("Enumerable OrderByDescending");

test("OrderByDescending Enumerable of simple types", function() {
    var source = $e([6, 2, 7, 3, 1]);
    var result = source.orderByDescending();
    var resultArray = result.toArray();

    equals(resultArray[0], 7, "Element 0");
    equals(resultArray[1], 6, "Element 1");
    equals(resultArray[2], 3, "Element 2");
    equals(resultArray[3], 2, "Element 3");
    equals(resultArray[4], 1, "Element 4");
});

test("OrderByDescending Enumerable of complex types", function() {
    var source = $e(pets);
    var result = source.orderByDescending(function(item) {
        return item.age;
    });
    var resultArray = result.toArray();

    equals(resultArray[0].age, 13, "Element 0");
    equals(resultArray[1].age, 2, "Element 1");
    equals(resultArray[2].age, 1, "Element 2");
});

test("OrderByDescending Enumerable of complex types", function() {
    var source = $e(pets);
    var result = source.orderByDescending(function(item1) {
        return item1.name;
    });
    var resultArray = result.toArray();

    equals(resultArray[0].name, "Rover", "Element 0");
    equals(resultArray[1].name, "Goldie", "Element 1");
    equals(resultArray[2].name, "Digby", "Element 2");
});

test("OrderByDescending Enumerable of complex types", function() {
    var source = $e(pets);
    var result = source.orderByDescending(null, function(item1, item2) {
        if (item1.name === item2.name) {
            return 0;
        } else if (item1.name < item2.name) {
            return -1;
        } else if (item2.name < item1.name) {
            return 1;
        }
    });
    var resultArray = result.toArray();

    equals(resultArray[0].name, "Rover", "Element 0");
    equals(resultArray[1].name, "Goldie", "Element 1");
    equals(resultArray[2].name, "Digby", "Element 2");
});

module("Enumerable Remove");

test("Remove simple type from Enumerable of simple types", function() {
    var source = $e([6, 2, 7, 3, 1]);

    equals(source.contains(3), true, "Contains value 3");

    var result = source.remove(3);

    equals(result, true, "Item was removed");
    equals(source.count(), 4, "Contains 4 elements");
    equals(source.contains(3), false, "Doesnt contain value 3");
});

test("Remove complex type from Enumerable of complex types", function() {
    var source = $e(animals);
    var itemToRemove = animals[5];

    equals(source.contains(itemToRemove), true, "Contains animal called Digby");

    var result = source.remove(itemToRemove);

    equals(result, true, "Item was removed");
    equals(source.count(), 9, "Contains 4 elements");
    equals(source.contains(itemToRemove), false, "Doesnt contain animal called Digby");
});

module("Enumerable RemoveAll");

test("RemoveAll simple types from Enumerable of simple types", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");
    equals(source.contains(0), true, "Contains value 0");
    equals(source.contains(1), true, "Contains value 1");
    equals(source.contains(2), true, "Contains value 2");
    equals(source.contains(3), true, "Contains value 3");

    var result = source.removeAll(function(item) {
        return item < 4;
    });

    equals(result, 4, "Items removed");
    equals(source.count(), 6, "Contains 6 elements");
    equals(source.contains(0), false, "Doesnt contain value 0");
    equals(source.contains(1), false, "Doesnt contain value 1");
    equals(source.contains(2), false, "Doesnt contain value 2");
    equals(source.contains(3), false, "Doesnt contain value 3");
});

test("RemoveAll complex types from Enumerable of complex types", function() {
    var source = $e(animals);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.removeAll(function(item) {
        return item.type === AnimalType.Fish;
    });

    equals(result, 3, "Items removed");
    equals(source.count(), 7, "Contains 7 elements");
});

module("Enumerable RemoveAt");

test("RemoveAt index from Enumerable of simple types", function() {
    var source = $e([5, 2, 63, 1, 2]);

    equals(source.count(), 5, "Contains 5 elements");

    var result = source.removeAt(3);

    equals(result, true, "Item was removed");
    equals(source.count(), 4, "Contains 4 elements");
    equals(source.contains(1), false, "Doesnt contain value 1");
});

test("RemoveAt index out of range from Enumerable of simple types", function() {
    var source = $e([5, 2, 63, 1, 2]);

    equals(source.count(), 5, "Contains 5 elements");

    var result = source.removeAt(10);

    equals(result, false, "Item wasn't removed");
    equals(source.count(), 5, "Contains 5 elements");
});

test("RemoveAt index from Enumerable of complex types", function() {
    var source = $e(pets);

    equals(source.count(), 3, "Contains 5 elements");

    var result = source.removeAt(1);

    equals(result, true, "Item was removed");
    equals(source.count(), 2, "Contains 4 elements");
});

test("RemoveAt index out of range from Enumerable of complex types", function() {
    var source = $e(pets);

    equals(source.count(), 3, "Contains 3 elements");

    var result = source.removeAt(10);

    equals(result, false, "Item wasn't removed");
    equals(source.count(), 3, "Contains 3 elements");
});

module("Enumerable RemoveRange");

test("RemoveAt index from Enumerable of simple types", function() {
    var source = $e([5, 2, 63, 1, 3]);

    equals(source.count(), 5, "Contains 5 elements");

    var result = source.removeRange(2, 3);

    equals(result, true, "Items were removed");
    equals(source.count(), 2, "Contains 2 elements");
    equals(source.contains(5), true, "Contains value 5");
    equals(source.contains(2), true, "Contains value 2");
    equals(source.contains(63), false, "Contains value 63");
    equals(source.contains(1), false, "Contains value 1");
    equals(source.contains(3), false, "Contains value 3");
});

test("RemoveAt index from Enumerable of simple types with count being more than element count", function() {
    var source = $e([5, 2, 63, 1, 3]);

    equals(source.count(), 5, "Contains 5 elements");

    var result = source.removeRange(2, 10);

    equals(result, true, "Items were removed");
    equals(source.count(), 2, "Contains 2 elements");
    equals(source.contains(5), true, "Contains value 5");
    equals(source.contains(2), true, "Contains value 2");
    equals(source.contains(63), false, "Contains value 63");
    equals(source.contains(1), false, "Contains value 1");
    equals(source.contains(3), false, "Contains value 3");
});

test("RemoveAt index from empty Enumerable", function() {
    var source = $e();

    equals(source.count(), 0, "Contains 0 elements");

    var result = source.removeRange(2, 2);

    equals(result, false, "No elements removed");
});

test("RemoveAt index from Enumerable of simple types with count being negative", function() {
    var source = $e([5, 2, 63, 1, 3]);

    equals(source.count(), 5, "Contains 5 elements");

    var exception = null;

    try {
        source.removeRange(2, -3);
    }
    catch (e) {
        exception = e;
    }

    equals(exception !== null, true, "Exception occurred");
    equals(exception, "Count is out of range", "Exception occurred");
});

module("Enumerable Reverse");

test("Reverse all elements", function() {
    var source = $e([5, 2, 63, 1, 3]);

    equals(source.count(), 5, "Contains 5 elements");
    equals(source.indexOf(5), 0, "Index of 5");
    equals(source.indexOf(2), 1, "Index of 2");
    equals(source.indexOf(63), 2, "Index of 63");
    equals(source.indexOf(1), 3, "Index of 1");
    equals(source.indexOf(3), 4, "Index of 3");

    var result = source.reverse();

    equals(source.count(), 5, "Contains 5 elements");
    equals(result.indexOf(5), 4, "Index of 5");
    equals(result.indexOf(2), 3, "Index of 2");
    equals(result.indexOf(63), 2, "Index of 63");
    equals(result.indexOf(1), 1, "Index of 1");
    equals(result.indexOf(3), 0, "Index of 3");
});

test("Reverse sub section of elements", function() {
    var source = $e([5, 2, 63, 1, 3]);

    equals(source.count(), 5, "Contains 5 elements");
    equals(source.indexOf(5), 0, "Index of 5");
    equals(source.indexOf(2), 1, "Index of 2");
    equals(source.indexOf(63), 2, "Index of 63");
    equals(source.indexOf(1), 3, "Index of 1");
    equals(source.indexOf(3), 4, "Index of 3");

    var result = source.reverse(2, 2);

    equals(source.count(), 5, "Contains 5 elements");
    equals(result.indexOf(5), 0, "Index of 5");
    equals(result.indexOf(2), 1, "Index of 2");
    equals(result.indexOf(63), 3, "Index of 63");
    equals(result.indexOf(1), 2, "Index of 1");
    equals(result.indexOf(3), 4, "Index of 3");
});

test("Reverse sub scetion of elements with count being more than element count", function() {
    var source = $e([5, 2, 63, 1, 3]);

    equals(source.count(), 5, "Contains 5 elements");
    equals(source.indexOf(5), 0, "Index of 5");
    equals(source.indexOf(2), 1, "Index of 2");
    equals(source.indexOf(63), 2, "Index of 63");
    equals(source.indexOf(1), 3, "Index of 1");
    equals(source.indexOf(3), 4, "Index of 3");

    var result = source.reverse(2, 10);

    equals(source.count(), 5, "Contains 5 elements");
    equals(result.indexOf(5), 0, "Index of 5");
    equals(result.indexOf(2), 1, "Index of 2");
    equals(result.indexOf(63), 4, "Index of 63");
    equals(result.indexOf(1), 3, "Index of 1");
    equals(result.indexOf(3), 2, "Index of 3");
});

test("Reverse sub section of elements with count negative", function() {
    var source = $e([5, 2, 63, 1, 3]);

    equals(source.count(), 5, "Contains 5 elements");

    var exception = null;

    try {
        source.reverse(2, -3).execute();
    }
    catch (e) {
        exception = e;
    }

    equals(exception !== null, true, "Exception occurred");
    equals(exception, "Count is out of range", "Exception occurred");
});

module("Enumerable Select");

test("Select from Enumerable of simple types", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.select(function(item) {
        return { index: item };
    }).execute();

    equals(result.count(), 10, "Contains 10 elements");
    equals(result.first().index, 0, "Contains selected item");
});

test("Select from Enumerable of complex types", function() {
    var source = $e(animals);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.select(function(item) {
        return item.name + " is " + item.age + " years old";
    }).execute();

    equals(result.count(), 10, "Contains 10 elements");
    equals(result.first(), "Rover is 13 years old", "Contains selected item");
});

module("Enumerable SelectMany");

test("SelectMany from Enumerable of complex types", function() {
    var source = $e(animals);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.selectMany(function(item, index) {
        return item.children;
    }).execute();

    equals(result.count(), 5, "Contains 5 elements");
    equals(result.elementAt(0), "Rover", "Contains item");
    equals(result.elementAt(1), "Scales", "Contains item");
    equals(result.elementAt(2), "Goldie", "Contains item");
    equals(result.elementAt(3), "Digby", "Contains item");
    equals(result.elementAt(4), "Kitty", "Contains item");
});

test("SelectMany from Enumerable of complex types with resultSelector", function() {
    var source = $e(animals);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.selectMany(function(item, index) {
        return item.children;
    }, function(item, selectedItem) {
        return item.name + " has a child called " + selectedItem;
    }).execute();

    equals(result.count(), 5, "Contains 5 elements");
    equals(result.elementAt(0), "Rex has a child called Rover", "Contains item");
    equals(result.elementAt(1), "Goldie has a child called Scales", "Contains item");
    equals(result.elementAt(2), "Goldie has a child called Goldie", "Contains item");
    equals(result.elementAt(3), "Fudge has a child called Digby", "Contains item");
    equals(result.elementAt(4), "Fudge has a child called Kitty", "Contains item");
});

module("Enumerable SequenceEqual");

test("SequenceEqual from Enumerable of simple types are equal", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.sequenceEqual(numbers0To9InOrder);

    equals(result, true, "Sequences are equal");
});

test("SequenceEqual from Enumerable of simple types aren't equal", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.sequenceEqual(numbers10To19InOrder);

    equals(result, false, "Sequences aren't equal");
});

test("SequenceEqual from Enumerable of complex types are equal", function() {
    var source = $e(animals);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.sequenceEqual(animals);

    equals(result, true, "Sequences are equal");
});

test("SequenceEqual from Enumerable of complex types are equal with equalityComparer", function() {
    var source = $e(animals);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.sequenceEqual(animals, function(item1, item2) {
        return item1.name === item2.name;
    });

    equals(result, true, "Sequences are equal");
});

module("Enumerable Single");

test("Single element from Enumerable of simple type", function() {
    var source = $e([5]);

    equals(source.count(), 1, "Contains 1 elements");

    var result = source.single();

    equals(result, 5, "Single item exists");
});

test("Single element from Enumerable of simple types", function() {
    var source = $e([5, 2]);

    equals(source.count(), 2, "Contains 2 elements");

    var exception = null;

    try {
        var result = source.single();
    }
    catch (e) {
        exception = e;
    }

    equals(exception !== null, true, "Exception occurred");
    equals(exception, "The sequence should only contain one element", "Exception occurred");
});

test("Single element from empty Enumerable", function() {
    var source = $e();

    equals(source.count(), 0, "Contains 0 elements");

    var exception = null;

    try {
        var result = source.single();
    }
    catch (e) {
        exception = e;
    }

    equals(exception !== null, true, "Exception occurred");
    equals(exception, "The sequence should only contain one element", "Exception occurred");
});

test("Single element from Enumerable with predicate", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.single(function(item) {
        return item >= 9;
    });

    equals(result, 9, "Single item exists");
});

test("Single element from empty Enumerable", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var exception = null;

    try {
        var result = source.single(function(item) {
            return item >= 5;
        });
    }
    catch (e) {
        exception = e;
    }

    equals(exception !== null, true, "Exception occurred");
    equals(exception, "The sequence should only contain one element", "Exception occurred");
});

module("Enumerable Skip");

test("Skip a number of elements in an Enumerable of simple type", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.skip(5);

    equals(source.count(), 10, "Source contains");
    equals(result.count(), 5, "Result contains");
    equals(result.elementAt(0), 5, "First element");
});

test("Skip a number of elements in an empty Enumerable", function() {
    var source = $e();

    equals(source.count(), 0, "Source contains");

    var result = source.skip(5);

    equals(source.count(), 0, "Source contains");
    equals(result.count(), 0, "Result contains");
});

module("Enumerable SkipWhile");

test("SkipWhile a elements in an Enumerable of simple type", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.skipWhile(function(item) {
        return item < 6;
    });

    equals(source.count(), 10, "Source contains");
    equals(result.count(), 4, "Result contains");
    equals(result.elementAt(0), 6, "First element");
});

test("SkipWhile a elements in an Enumerable of complex type", function() {
    var source = $e(animals);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.skipWhile(function(item) {
        return item.age < 20;
    });

    equals(source.count(), 10, "Source contains");
    equals(result.count(), 6, "Result contains");
    equals(result.elementAt(0).name, "Fudge", "First element");
});

module("Enumerable Sum");

test("Sum elements in an Enumerable of simple type without selector", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.sum();

    equals(source.count(), 10, "Source contains");
    equals(result, 45, "Sum");
});

test("Sum elements in an Enumerable of simple type with selector", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.sum(function(item) {
        return item;
    });

    equals(source.count(), 10, "Source contains");
    equals(result, 45, "Sum");
});

test("Sum elements in an Enumerable of complex type with selector", function() {
    var source = $e(pets);

    equals(source.count(), 3, "Contains 3 elements");

    var result = source.sum(function(item) {
        return item.age;
    });

    equals(source.count(), 3, "Source contains");
    equals(result, 16, "Sum");
});

module("Enumerable Take");

test("Take elements in an Enumerable of simple type", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.take(3);

    equals(source.count(), 10, "Source contains");
    equals(result.count(), 3, "Source contains");
    equals(result.elementAt(0), 0, "ELementAt");
    equals(result.elementAt(1), 1, "ELementAt");
    equals(result.elementAt(2), 2, "ELementAt");
});

test("Take more elements from an an Enumerable of simple type than exist", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var exception = null;

    try {
        var result = source.take(11).execute();
    } catch (e) {
        exception = e;
    }

    equals(source.count(), 10, "Source contains");
    equals(exception !== null, true, "Exception occurred");
    equals(exception, "Cannot take more elements than exist", "Exception");
});

test("Take elements in an empty Enumerable", function() {
    var source = $e();

    equals(source.count(), 0, "Contains 0 elements");

    var exception = null;

    try {
        var result = source.take(11).execute();
    } catch (e) {
        exception = e;
    }

    equals(source.count(), 0, "Source contains");
    equals(exception !== null, true, "Exception occurred");
    equals(exception, "Cannot take more elements than exist", "Exception");
});

module("Enumerable TakeWhile");

test("TakeWhile elements in an Enumerable of simple type", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.takeWhile(function(item) {
        return item < 4;
    });

    equals(source.count(), 10, "Source contains");
    equals(result.count(), 4, "Result contains");
    equals(result.elementAt(0), 0, "ELementAt");
    equals(result.elementAt(1), 1, "ELementAt");
    equals(result.elementAt(2), 2, "ELementAt");
    equals(result.elementAt(3), 3, "ELementAt");
});

test("TakeWhile elements in an Enumerable of simple type", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.takeWhile(function(item) {
        return item < -1;
    });

    equals(source.count(), 10, "Source contains");
    equals(result.count(), 0, "Result contains");
});

test("TakeWhile elements in an Enumerable of simple type", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.takeWhile(function(item) {
        return item < 20;
    });

    equals(source.count(), 10, "Source contains");
    equals(result.count(), 10, "Result contains");
});

test("TakeWhile elements in an Enumerable of complex type", function() {
    var source = $e(animals);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.takeWhile(function(item) {
        return item.age < 20;
    });

    equals(source.count(), 10, "Source contains");
    equals(result.count(), 4, "Result contains");
});

module("Enumerable ToArray");

test("ToArray elements in an Enumerable of simple type", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.toArray();

    equals(source.count(), 10, "Source contains");
    equals(result.length, 10, "Result contains");
});

test("ToArray elements in an Enumerable expression of simple type", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.where(function(item) {
        return item <= 5;
    }).toArray();

    equals(source.count(), 10, "Source contains");
    equals(result.length, 6, "Result contains");
});

module("Enumerable ToDictionary");

test("ToDictionary elements in an Enumerable of complex type", function() {
    var source = $e(animals);

    equals(source.count(), 10, "Contains 10 elements");

    var exception = null;

    try {
        var result = source.toDictionary(function(item) {
            return item.type;
        });
    } catch (e) {
        exception = e;
    }

    equals(source.count(), 10, "Source contains");
    equals(exception !== null, true, "Exception occurred");
    equals(exception, "An item with the same key has already been added.", "Exception");
});

test("ToDictionary elements in an Enumerable of complex type without selector", function() {
    var source = $e(pets);

    equals(source.count(), 3, "Contains 3 elements");

    var result = source.toDictionary(function(item) {
        return item.type;
    });

    equals(source.count(), 3, "Source contains");
    equals(typeof result[AnimalType.Cat] !== "undefined", true, "Contains a key 'cat'");
    equals(typeof result[AnimalType.Fish] !== "undefined", true, "Contains a key 'fish'");
    equals(typeof result[AnimalType.Dog] !== "undefined", true, "Contains a key 'dog'");
});

test("ToDictionary elements in an Enumerable of complex type with selector", function() {
    var source = $e(pets);

    equals(source.count(), 3, "Contains 3 elements");

    var result = source.toDictionary(function(item) {
        return item.type;
    }, function(item) {
        return { name: item.name };
    });

    equals(source.count(), 3, "Source contains");
    equals(typeof result[AnimalType.Cat] !== "undefined", true, "Contains a key 'cat'");
    equals(typeof result[AnimalType.Fish] !== "undefined", true, "Contains a key 'fish'");
    equals(typeof result[AnimalType.Dog] !== "undefined", true, "Contains a key 'dog'");
    equals(result[AnimalType.Cat].name, "Digby", "Digby called");
    equals(result[AnimalType.Fish].name, "Goldie", "Goldie called");
    equals(result[AnimalType.Dog].name, "Rover", "Rover called");
});

test("ToDictionary elements in an Enumerable of complex type with selector and equalitycomparer", function() {
    var source = $e(pets);

    equals(source.count(), 3, "Contains 3 elements");

    var result = source.toDictionary(function(item) {
        return item.type;
    }, function(item) {
        return { name: item.name };
    }, function(item1, item2) {
        return item1 === item2;
    });

    equals(source.count(), 3, "Source contains");
    equals(typeof result[AnimalType.Cat] !== "undefined", true, "Contains a key 'cat'");
    equals(typeof result[AnimalType.Fish] !== "undefined", true, "Contains a key 'fish'");
    equals(typeof result[AnimalType.Dog] !== "undefined", true, "Contains a key 'dog'");
    equals(result[AnimalType.Cat].name, "Digby", "Digby called");
    equals(result[AnimalType.Fish].name, "Goldie", "Goldie called");
    equals(result[AnimalType.Dog].name, "Rover", "Rover called");
});

module("Enumerable Union");

test("Union an Enumerable of simple type with Enumerable of simple type", function() {
    var source1 = $e(numbers0To9InOrder);
    var source2 = $e(numbers10To19InOrder);

    equals(source1.count(), 10, "Contains 10 elements");
    equals(source2.count(), 10, "Contains 10 elements");

    var result = source1.union(source2);

    equals(source1.count(), 10, "Source1 contains");
    equals(source2.count(), 10, "Source2 contains");
    equals(result.count(), 20, "Result contains");
});

test("Union an Enumerable of simple type with Array of simple type", function() {
    var source1 = $e(numbers0To9InOrder);

    equals(source1.count(), 10, "Contains 10 elements");
    equals(numbers10To19InOrder.length, 10, "Contains 10 elements");

    var result = source1.union(numbers10To19InOrder);

    equals(source1.count(), 10, "Source1 contains");
    equals(numbers10To19InOrder.length, 10, "Source2 contains");
    equals(result.count(), 20, "Result contains");
});

test("Union an Enumerable of simple type with Enumerable of simple type", function() {
    var source1 = $e(numbers0To9InOrder);
    var source2 = $e(numbers0To9InOrder);

    equals(source1.count(), 10, "Contains 10 elements");
    equals(source2.count(), 10, "Contains 10 elements");

    var result = source1.union(source2);

    equals(source1.count(), 10, "Source1 contains");
    equals(source2.count(), 10, "Source2 contains");
    equals(result.count(), 10, "Result contains");
});

test("Union an Enumerable of complex type with Enumerable of complex type", function() {
    var source1 = $e(animals);
    var source2 = $e(pets);

    equals(source1.count(), 10, "Contains 10 elements");
    equals(source2.count(), 3, "Contains 3 elements");

    var result = source1.union(source2);

    equals(source1.count(), 10, "Source1 contains");
    equals(source2.count(), 3, "Source2 contains");
    equals(result.count(), 13, "Result contains");
});

test("Union an Enumerable of complex type with Enumerable of complex type with equalitycomparer", function() {
    var source1 = $e(animals);
    var source2 = $e(pets);

    equals(source1.count(), 10, "Contains 10 elements");
    equals(source2.count(), 3, "Contains 3 elements");

    var result = source1.union(source2, function(item1, item2) {
        return item1.type === item2.type;
    });

    equals(source1.count(), 10, "Source1 contains");
    equals(source2.count(), 3, "Source2 contains");
    equals(result.count(), 3, "Result contains");
});

module("Enumerable Where");

test("Where an Enumerable of simple types", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.where(function(item) {
        return item > 4;
    });

    equals(source.count(), 10, "Source contains");
    equals(result.count(), 5, "Result contains");
});

test("Where an Enumerable of simple types twice", function() {
    var source = $e(numbers0To9InOrder);

    equals(source.count(), 10, "Contains 10 elements");

    var result = source.where(function(item) {
        return item > 4;
    }).where(function(item) {
        return item < 7;
    });

    equals(source.count(), 10, "Source contains");
    equals(result.count(), 2, "Result contains");
});

module("Enumerable Range");

test("Get a Range of integers as an Enumerable", function() {
    var result = Enumerable.range(0, 10);

    equals(result.count(), 10, "Source contains");
    equals(result.elementAt(0), 0, "Result starts with");
    equals(result.elementAt(9), 9, "Result ends with");
});

test("Get a Range of integers as an Enumerable", function() {
    var result = Enumerable.range(-5, 10);

    equals(result.count(), 10, "Source contains");
    equals(result.elementAt(0), -5, "Result starts with");
    equals(result.elementAt(9), 4, "Result ends with");
});

test("Get a Range of integers as an Enumerable", function() {
    var exception = null;

    try {
        var result = Enumerable.range(0, -1);
    } catch (e) {
        exception = e;
    }

    equals(exception !== null, true, "Exception occurred");
    equals(exception, "Count is out of range.", "Exception");
});

module("Enumerable Repeat");

test("Repeat a simple type as an Enumerable", function() {
    var result = Enumerable.repeat(6, 10);

    equals(result.count(), 10, "Source contains");
    equals(result.elementAt(0), 6, "Result starts with");
    equals(result.elementAt(9), 6, "Result ends with");
});

test("Repeat a complex type as an Enumerable", function() {
    var result = Enumerable.repeat({ name: "Frank", age: 12 }, 10);

    equals(result.count(), 10, "Source contains");
    equals(result.elementAt(0).name, "Frank", "Result starts with");
    equals(result.elementAt(9).name, "Frank", "Result ends with");
});

test("Repeat a simple type as an Enumerable", function() {
    var exception = null;

    try {
        var result = Enumerable.repeat(0, -1);
    } catch (e) {
        exception = e;
    }

    equals(exception !== null, true, "Exception occurred");
    equals(exception, "Count is out of range.", "Exception");
});