import { httpGet } from './mock-http-interface';

enum ResultKey {
  Success = 'Arnie Quote',
  Fail = 'FAILURE'
}

enum PromiseStatus {
  Fulfill = 'fulfilled',
  Rejected = 'rejected'
}

type TResult = Record<ResultKey.Success, string> | Record<ResultKey.Fail, string>;

export const getArnieQuotes = async (urls: string[]): Promise<TResult[]> => {
  try {
    const requests = urls.map(url => {
      return httpGet(url);
    });
    const responses = await Promise.allSettled(requests)
    return responses.map(result => {
      if (result.status === PromiseStatus.Rejected) {
        return { [ResultKey.Fail]: result.reason };
      }
      const { status, body } = result.value;
      const { message } = JSON.parse(body);

      if (status === 200) {
        return { [ResultKey.Success]: message };
      }
      return { [ResultKey.Fail]: message };
    })
  } catch (error) {
    // in production, do not show console.
    console.log('Error occurs while fetching Arnie quotes', error);
    // in case no error handler in caller, make sure return a array.
    return [];
  }
};
