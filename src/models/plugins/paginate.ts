/* eslint-disable no-param-reassign */

import { Schema } from "mongoose";

export type TPaginationResult = {
  results: any[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export const paginate = (schema: Schema) => {
  schema.statics.paginate = async function (filter, options): Promise<TPaginationResult> {
    let sort = "";
    if (options.sortBy) {
      const sortingCriteria: any[] = [];
      options.sortBy.split(",").forEach((sortOption: any) => {
        const [key, order] = sortOption.split(":");
        sortingCriteria.push((order === "desc" ? "-" : "") + key);
      });
      sort = sortingCriteria.join(" ");
    } else {
      sort = "createdAt";
    }

    const limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? Math.min(parseInt(options.limit, 10), 50)
        : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.split(",").forEach((populateOption: any) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split(".")
            .reverse()
            .reduce((a: any, b: any) => ({ path: b, populate: a }))
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults
      };
      return Promise.resolve(result);
    });
  };
};
