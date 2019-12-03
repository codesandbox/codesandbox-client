import React from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import {
  unstable_Form as Form,
  unstable_useFormState as useFormState,
} from 'reakit/Form';
import { object, string, array, InferType, ValidationError } from 'yup';
import set from 'lodash/set';
import { Link } from '@codesandbox/common/lib/components';
import { Icons } from './Icons';
import {
  Container,
  AboutUser,
  ProfilePicture,
  Avatar,
  ProBadge,
  TeamBadge,
  Name,
  Username,
  BioInput,
  InputCounter,
  Bio,
  Associations,
  SubHeader,
  Grid,
  Thumbnail,
  SocialMedia,
  Places,
  LinkInput,
  RemoveLink,
  InputError,
  SocialLink,
  Edit,
  Save,
  Cancel,
  AddSite,
} from './elements';

const getIcon = (url: string): React.ReactNode =>
  Icons[
    (
      new URL(url).hostname
        .split(`.`)
        .find(domain => Object.keys(Icons).includes(domain)) || `web`
    ).toLowerCase()
  ];

const schema = object({
  bio: string(),
  socialLinks: array().of(string().url(`Please provide a valid URL`)),
});

type Values = InferType<typeof schema>;

const validateWithYup = (values: Values) =>
  schema.validate(values, { abortEarly: false }).then(
    () => {},
    (error: ValidationError) => {
      if (error.inner.length) {
        throw error.inner.reduce(
          (errors: {}, curr: ValidationError) =>
            set(errors, curr.path, curr.message),
          {}
        );
      }
    }
  );

interface IUserInfoProps {
  avatar: string;
  isPro: boolean;
  isTeam: boolean;
  name: string;
  username: string;
  bio: string;
  associations: {
    thumbnail: string;
    url: string;
    entityName: string;
  }[];
  socialLinks: string[];
  isEditing: boolean;
  canEdit: boolean;
  toggleEditing: () => void;
  onEdit: (values: Values) => void;
}

export const UserInfo: React.FC<IUserInfoProps> = ({
  avatar,
  isPro,
  isTeam,
  name,
  username,
  bio,
  associations,
  socialLinks,
  isEditing = false,
  canEdit = true,
  toggleEditing,
  onEdit,
}) => {
  const initialValues = { bio, socialLinks };
  const form = useFormState({
    values: initialValues,
    onValidate: validateWithYup,
    onSubmit: (values: Values) => {
      values.socialLinks = values.socialLinks.filter((link: string) => link);
      // onEdit(values)
      toggleEditing();
    },
  });

  const reset = () => {
    form.reset();
    toggleEditing();
  };

  // TODO:
  // - Need support for uploading Team Avatars

  return (
    <Container
      as={isEditing ? Form : undefined}
      {...(isEditing ? { ...form, autoComplete: 'off' } : {})}
    >
      <AboutUser>
        <ProfilePicture>
          <Avatar src={avatar} />
          {(isPro && <ProBadge>Pro</ProBadge>) ||
            (isTeam && <TeamBadge>Team</TeamBadge>)}
        </ProfilePicture>
        <Name>{name}</Name>
        <Username>{username}</Username>
        {isEditing ? (
          <Bio>
            <BioInput {...form} name="bio" valid={!form.errors.bio} />
            <InputCounter valid={form.values.bio.length <= 280}>{`${form.values
              .bio.length || 0} / 280`}</InputCounter>
          </Bio>
        ) : (
          <Bio>{bio}</Bio>
        )}
      </AboutUser>
      {associations.length && (
        <Associations>
          <SubHeader>{isTeam ? `Team Members` : `Teams`}</SubHeader>
          <Grid>
            {associations.map(({ thumbnail, url, entityName }) => (
              <Link key={entityName} to={url} alt={entityName}>
                <Thumbnail src={thumbnail} />
              </Link>
            ))}
          </Grid>
        </Associations>
      )}
      {(isEditing || socialLinks.length) && (
        <SocialMedia>
          <SubHeader>Other Places</SubHeader>
          <Places>
            {form.values.socialLinks.map((url: string, i: number) => (
              <>
                {/* eslint-disable */}
                <SocialLink key={i}>
                  {/* eslint-enable */}
                  {isEditing ? (
                    <>
                      <LinkInput
                        {...form}
                        name={['socialLinks', i]}
                        valid={
                          !(
                            form.errors.socialLinks &&
                            form.errors.socialLinks[i]
                          )
                        }
                      />
                      <RemoveLink {...form} name="socialLinks" index={i}>
                        <MdClose />
                      </RemoveLink>
                      <InputError {...form} name={['socialLinks', i]} />
                    </>
                  ) : (
                    <Link external to={url}>
                      {getIcon(url)}
                      {url}
                    </Link>
                  )}
                </SocialLink>
              </>
            ))}
          </Places>
          {isEditing && (
            <AddSite {...form} name="socialLinks" value="">
              <MdAdd />
              Add Website
            </AddSite>
          )}
        </SocialMedia>
      )}
      {isEditing && canEdit ? (
        <>
          <Save {...form}>Save Changes</Save>
          <Cancel onClick={reset}>Cancel</Cancel>
        </>
      ) : (
        <Edit onClick={toggleEditing}>Edit Profile</Edit>
      )}
    </Container>
  );
};
