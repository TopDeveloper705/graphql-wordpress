import { ObjectId } from 'mongodb';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { merge } from 'lodash';
import tagResolvers from './Tag';
import videoResolvers from './Video';

const resolvers = {};

resolvers.ObjID = new GraphQLScalarType({
  name: 'ObjID',
  description: 'Id representation, based on Mongo Object Ids',
  parseValue(value) {
    return ObjectId(value);
  },
  serialize(value) {
    return value.toString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ObjectId(ast.value);
    }
    return null;
  },
});

export default resolvers;

merge(resolvers, tagResolvers);
merge(resolvers, videoResolvers);
