'use strict';

const curry = fn => (...args) => (
  fn.length > args.length ? curry(
    ((fn, ...args1) => (...args2) => (
      fn(...args1.concat(args2))
    ))(fn, ...args)
  ) : fn(...args)
);

function curryProto(fn) {                                    // та же curry (слегка изменена)
	return function(...args) {
		if (fn.length > args.length) {						 // если аргументов НЕдостаточно
			return curry1(function(...args2) {               // у function(...args2) свойство fn.length = 0!!!  
						return fn(...args.concat(args2));	 // Поэтому при следующем цикле рекурсии условие if не
					})										 // срабатывает и даже если аргументов недостаточно, то
		}											 		 // всё равно выполняется else.
		else return fn(...args);							 // если аргументов достаточно
	}
}

function curryFixedProto(fn, fnLength = fn.length) {         // Добавляем свойство fnLength, которое будет                        
	return function(...args) {								 // указывать на количество оставшихся требуемых
		if (fnLength > args.length) { 						 // аргументов. Изначально равно количеству
			return curryFixed(function(...args2) {           // аргументов в каррируемой функции, потом в ходе
						return fn(...args.concat(args2))	 // рекурсии уменьшается на количество добавленных
						}, fnLength - args.length)			 // аргументов.					 											 
		}
		else return fn(...args);							 
	}
}

const curryFixed = (fn, fnLength = fn.length) => (...args) => (  // свёрнутая curryFixedProto
	fnLength > args.length ? curryFixed(
		(...args2) => fn(...args.concat(args2)), 
		fnLength - args.length
	) : fn(...args)
);

// Usage

const sum4 = (a, b, c, d) => (a + b + c + d);

const f = curryFixed(sum4);
const y1 = sum4(1, 2, 3, 4);
const y2 = f(1, 2, 3, 4);
const y3 = f(1, 2, 3)(4);
const y4 = f(1, 2)(3)(4);
const y5 = f(1)(2)(3)(4);
const y6 = f(1)(2, 3, 4);
const y7 = f(1)(2)(3, 4);
const y8 = f(1, 2)(3, 4);
console.log(y1, y2, y3, y4, y5, y6, y7, y8);
