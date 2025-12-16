"use client";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useRouter } from "next/navigation";
import type { Workflow } from "@/generated/prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useCredentialParams } from "@/features/credentials/hooks/use-credentials-params";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "@/features/credentials/hooks/use-credentials";
import { useEntitySearch } from "@/features/credentials/hooks/use-entity-search";

export const CredentialsSearch = () => {
  const router = useRouter();
  const [params, setParams] = useCredentialParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Credentials"
    />
  );
};

export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialParams();

  return (
    <EntityPagination
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPages}
      page={credentials.data.page}
      onPageChange={(page) =>
        setParams({
          ...params,
          page,
        })
      }
    />
  );
};

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(workflow) => <CredentialsItem data={workflow} />}
      emptyView={<CredentialsEmpty />}
    />
  );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage your credentials"
      newButtonHref={"/credentials/new"}
      newButtonLabel="New credentials"
      disabled={disabled}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="Loading Credentials..." />;
};

export const CredentialsError = () => {
  return <ErrorView message="Error Loading Credentials..." />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();
  const handleCreate = () => {
    router.push(`/credentials/new`);
  };
  return (
    <>
      <EmptyView
        onNew={handleCreate}
        message="You haven't created any credentials yet, Get started by creating your first credential"
      />
    </>
  );
};

export const CredentialsItem = ({ data }: { data: Workflow }) => {
  const removeCredential = useRemoveCredential();

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };

  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })} •
          Created {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 tetx-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};
