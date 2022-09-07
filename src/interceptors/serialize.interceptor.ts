// We call it Serialize Interceptor because
// it going to take an Object and 
// Serialize that eventually into JSON

import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass, plainToInstance } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

// Pass this as a TYPE and supply any class and this interface would be happy
interface ClassConstructor {
  new(...args: any[]): {}
}

// This is our custom Decorator
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
};

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Run something before a request is handled
    // by the request handler

    console.log("I'm running before the handler", context);

    return next.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        console.log("I'm running before response is sent out", data);

        // return plainToClass(this.dto, data, {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // Only return properties under UserDto which are marked with @Expose()
        })
      }),
    )
  }
}