using ServerApp.TaskRepository;

namespace ServerApp.UnitOfWork;

public interface IUnitOfWork : IDisposable, IAsyncDisposable
{
    ITaskRepository Tasks { get; }
    Task<int> CompleteAsync(CancellationToken cancellationToken = default);

    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
